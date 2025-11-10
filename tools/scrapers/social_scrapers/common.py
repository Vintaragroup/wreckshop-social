import asyncio
import os
from dataclasses import asdict
from typing import Dict, Iterable, Optional, Union

import httpx


def build_proxies(proxy: Optional[str] = None,
                  proxy_http: Optional[str] = None,
                  proxy_https: Optional[str] = None) -> Optional[Union[str, Dict[str, str]]]:
    if proxy:
        return proxy
    else:
        d: Dict[str, str] = {}
        http = proxy_http or os.environ.get("HTTP_PROXY") or os.environ.get("http_proxy")
        https = proxy_https or os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
        if http:
            d["http://"] = http
        if https:
            d["https://"] = https
        return d or None


def write_jsonl(path: str, items: Iterable[dict]):
    import orjson
    with open(path, "wb") as f:
        for c in items:
            f.write(orjson.dumps(c))
            f.write(b"\n")


async def ingest_candidates(backend: str, items: Iterable[dict], provider: str, delay_ms=(150, 450)):
    backend = backend.rstrip("/")
    low, high = delay_ms
    async with httpx.AsyncClient(timeout=20) as client:
        for c in items:
            try:
                handle_or_url = c.get("profile_url") or c.get("handle") or c.get("id")
                await client.post(f"{backend}/api/profiles/ingest", json={
                    "provider": provider,
                    "handleOrUrl": handle_or_url,
                })
            except Exception:
                pass
            await asyncio.sleep((low + (high - low) * 0.5) / 1000.0)
