#!/usr/bin/env python3
import argparse
import asyncio
import os
import sys
from typing import Dict, List, Optional

import httpx

# Ensure 'scripts' is on path so 'social_scrapers' package is importable when run directly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from social_scrapers.common import build_proxies, write_jsonl, ingest_candidates


async def yt_request(api_key: str, path: str, params: Dict[str, str], proxies=None) -> dict:
    async with httpx.AsyncClient(timeout=25, proxies=proxies) as client:
        u = httpx.URL("https://www.googleapis.com/youtube/v3" + path)
        qp = dict(params)
        qp["key"] = api_key
        r = await client.get(u, params=qp)
        r.raise_for_status()
        return r.json()


async def resolve_channel_id_from_handle(api_key: str, handle: str, proxies=None) -> Optional[str]:
    # Handles are like @ChannelHandle
    if handle.startswith("@"): handle = handle[1:]
    # Search for channel by handle
    data = await yt_request(api_key, "/search", {"part": "snippet", "q": handle, "type": "channel", "maxResults": "1"}, proxies)
    items = data.get("items", [])
    if not items: return None
    return items[0].get("snippet", {}).get("channelId") or items[0].get("id", {}).get("channelId")


async def get_channel_details(api_key: str, channel_id: str, proxies=None) -> dict:
    data = await yt_request(api_key, "/channels", {"part": "snippet,statistics,brandingSettings", "id": channel_id}, proxies)
    item = (data.get("items") or [None])[0] or {}
    snippet = item.get("snippet", {})
    stats = item.get("statistics", {})
    branding = item.get("brandingSettings", {})
    featured_ids = branding.get("channel", {}).get("featuredChannelsUrls", []) or []
    return {
        "channelId": channel_id,
        "title": snippet.get("title"),
        "description": snippet.get("description"),
        "thumbnails": snippet.get("thumbnails", {}),
        "subscriberCount": int(stats.get("subscriberCount", 0)) if stats.get("subscriberCount") else None,
        "videoCount": int(stats.get("videoCount", 0)) if stats.get("videoCount") else None,
        "featuredChannelIds": featured_ids,
    }


async def get_channel_section_links(api_key: str, channel_id: str, proxies=None) -> List[str]:
    # Fetch channel sections for additional featured channels
    try:
        data = await yt_request(api_key, "/channelSections", {"part": "snippet,contentDetails", "channelId": channel_id}, proxies)
        out: List[str] = []
        for item in data.get("items", []):
            subs = item.get("contentDetails", {}).get("channels", [])
            for ch in subs:
                if ch not in out:
                    out.append(ch)
        return out
    except Exception:
        return []


def to_candidate(ch: dict) -> dict:
    title = ch.get("title") or ch.get("channelId")
    return {
        "provider": "youtube",
        "providerUserId": ch.get("channelId"),
        "displayName": title,
        "handle": None,
        "profile_url": f"https://www.youtube.com/channel/{ch.get('channelId')}",
        "avatar_url": (ch.get("thumbnails", {}).get("high") or ch.get("thumbnails", {}).get("default") or {}).get("url"),
        "followers": ch.get("subscriberCount"),
        "tracks": ch.get("videoCount"),
        "bio": (ch.get("description") or None),
    }


async def crawl_featured(api_key: str, seed_channel_id: str, limit: int, proxies=None) -> List[dict]:
    seen = set()
    queue: List[str] = [seed_channel_id]
    out: List[dict] = []
    while queue and len(out) < limit:
        ch_id = queue.pop(0)
        if ch_id in seen: continue
        seen.add(ch_id)
        details = await get_channel_details(api_key, ch_id, proxies)
        out.append(to_candidate(details))
        # Extend queue with featured channels
        featured = details.get("featuredChannelIds", [])
        # plus sections
        more = await get_channel_section_links(api_key, ch_id, proxies)
        for nxt in featured + more:
            if nxt not in seen and nxt not in queue and len(out) + len(queue) < limit * 2:
                queue.append(nxt)
    return out[:limit]


async def search_channels(api_key: str, query: str, limit: int, proxies=None) -> List[dict]:
    results: List[dict] = []
    page_token = None
    while len(results) < limit:
        params = {"part": "snippet", "q": query, "type": "channel", "maxResults": "50"}
        if page_token: params["pageToken"] = page_token
        data = await yt_request(api_key, "/search", params, proxies)
        for item in data.get("items", []):
            ch_id = item.get("snippet", {}).get("channelId") or item.get("id", {}).get("channelId")
            if ch_id:
                details = await get_channel_details(api_key, ch_id, proxies)
                results.append(to_candidate(details))
                if len(results) >= limit: break
        page_token = data.get("nextPageToken")
        if not page_token: break
    return results[:limit]


async def main():
    ap = argparse.ArgumentParser(description="YouTube channel discovery crawler")
    ap.add_argument("--seed-channel-id", type=str)
    ap.add_argument("--seed-handle", type=str, help="YouTube handle like @SomeChannel")
    ap.add_argument("--query", type=str, help="Search query to discover channels")
    ap.add_argument("--max-users", type=int, default=50)
    ap.add_argument("--emit-jsonl", type=str)
    ap.add_argument("--backend", type=str)
    ap.add_argument("--ingest", action="store_true")
    ap.add_argument("--proxy", type=str)
    ap.add_argument("--proxy-http", type=str)
    ap.add_argument("--proxy-https", type=str)
    ap.add_argument("--api-key", type=str, help="YouTube Data API key (falls back to YOUTUBE_API_KEY env)")
    args = ap.parse_args()

    api_key = args.api_key or os.environ.get("YOUTUBE_API_KEY")
    if not api_key:
        print("Missing YOUTUBE_API_KEY; provide --api-key or env", flush=True)
        return

    proxies = build_proxies(args.proxy, args.proxy_http, args.proxy_https)

    candidates: List[dict] = []
    if args.seed_channel_id or args.seed_handle:
        ch_id = args.seed_channel_id
        if not ch_id and args.seed_handle:
            ch_id = await resolve_channel_id_from_handle(api_key, args.seed_handle, proxies)
        if not ch_id:
            print("Unable to resolve channel id from handle", flush=True)
            return
        candidates = await crawl_featured(api_key, ch_id, args.max_users, proxies)
    elif args.query:
        candidates = await search_channels(api_key, args.query, args.max_users, proxies)
    else:
        print("Provide --seed-channel-id/--seed-handle or --query", flush=True)
        return

    if args.emit_jsonl:
        write_jsonl(args.emit_jsonl, candidates)
        print(f"Wrote {len(candidates)} channels to {args.emit_jsonl}")

    if args.backend and args.ingest and candidates:
        await ingest_candidates(args.backend, candidates, provider="youtube")
        print(f"Ingest requested for {len(candidates)} users at {args.backend}")

    print(f"Discovered {len(candidates)} channels")
    if candidates:
        print(f"Example: {candidates[0].get('displayName')} -> {candidates[0].get('profile_url')}")


if __name__ == "__main__":
    asyncio.run(main())
