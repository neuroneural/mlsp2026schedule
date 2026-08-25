# MLSP 2026 searchable schedule

A static, single-page conference schedule generated from the accepted-paper assignment workbook and submission-status export.

## Rebuild the paper data

The checked-in `data/papers.json` is the deployable data file. To rebuild it, run:

```bash
node scripts/build-data.mjs
```

The script cross-references accepted submission numbers and forum links, calculates each 15-minute oral slot from the confirmed presentation order, and enriches exact public arXiv title matches with author names.

## Import all authors from OpenReview

Organizer access can resolve the author list and profile link directly from every submission note. Install the official client, then run the importer; it prompts for credentials securely and does not save them:

```bash
python3 -m pip install openreview-py
python3 scripts/import-openreview-authors.py --dry-run
python3 scripts/import-openreview-authors.py
node scripts/verify-data.mjs
```

Run this after `build-data.mjs`, because rebuilding the paper data replaces `data/papers.json`.

## Run locally

Serve the directory over HTTP (the page fetches its JSON data file):

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.
