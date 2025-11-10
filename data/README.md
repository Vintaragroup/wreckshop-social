# Data Files

Sample and test data files organized by category. These files are not essential for development and can be removed if needed.

## Structure

### `test/`
Test data files for development and validation:
- `test-spotify.jsonl` - Spotify API test data

### `lastfm-genres/`
Sample Last.fm artist data organized by genre (150-200 artists each):
- `out-lastfm-electronic-150.jsonl` - Electronic genre artists
- `out-lastfm-hiphop-150.jsonl` - Hip-hop genre artists
- `out-lastfm-indie-150.jsonl` - Indie genre artists
- `out-lastfm-pop-150.jsonl` - Pop genre artists
- `out-lastfm-rnb-200.jsonl` - R&B genre artists (200 artists)
- `out-lastfm-soul-150.jsonl` - Soul genre artists

### `user-samples/`
Sample user discovery data from real Spotify users:
- `out-seed-Bcesar08.jsonl` - User @Bcesar08 profile data
- `out-seed-LilTiffany7.jsonl` - User @LilTiffany7 profile data
- `out-seed-nalieshia23.jsonl` - User @nalieshia23 profile data

### `enriched-artists/`
Artist data in various processing stages:
- `out-rnb.jsonl` - Base R&B artist dataset
- `out-rnb-20.jsonl` - R&B subset (20 artists)
- `out-rnb-100-enriched.jsonl` - R&B enriched (100 artists)
- `out-rnb-enriched.jsonl` - R&B enriched (full)
- `out-weeknd.jsonl` - The Weeknd artist data
- `out-weeknd-enriched.jsonl` - The Weeknd enriched data

## Usage

These files can be used for:
- Testing data processing pipelines
- Development and validation
- Demonstrating data structures
- Training and examples

## Format

All files are in JSONL (JSON Lines) format - one JSON object per line:
```
{"artist": "Artist Name", ...}
{"artist": "Another Artist", ...}
```

## Cleanup

If these files are no longer needed, they can be safely deleted to reduce repository size.

---

**Note**: No code references these files. They are purely for reference and testing purposes.
