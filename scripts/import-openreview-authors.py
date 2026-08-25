#!/usr/bin/env python3
"""Fill schedule author names and OpenReview profile links using organizer access."""

from __future__ import annotations

import argparse
import getpass
import json
import os
from pathlib import Path
from urllib.parse import parse_qs, quote, urlparse

try:
    import openreview
except ImportError as error:
    raise SystemExit(
        "Install the OpenReview client first: python3 -m pip install openreview-py"
    ) from error


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "papers.json"


def content_value(field):
    """Read both API v2 {value: ...} fields and legacy API v1 values."""
    if isinstance(field, dict) and "value" in field:
        return field["value"]
    return field


def forum_id(url: str) -> str:
    note_id = parse_qs(urlparse(url).query).get("id", [None])[0]
    if not note_id:
        raise ValueError(f"OpenReview URL has no forum id: {url}")
    return note_id


def profile_url(author_id: str) -> str:
    return f"https://openreview.net/profile?id={quote(author_id, safe='~_-.@')}"


def credentials() -> tuple[str, str]:
    username = os.environ.get("OPENREVIEW_USERNAME") or input("OpenReview username: ").strip()
    password = os.environ.get("OPENREVIEW_PASSWORD") or getpass.getpass("OpenReview password: ")
    if not username or not password:
        raise SystemExit("OpenReview username and password are required.")
    return username, password


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import author names and profile links from each paper's OpenReview note."
    )
    parser.add_argument("--dry-run", action="store_true", help="Fetch and report without changing data/papers.json")
    args = parser.parse_args()

    username, password = credentials()
    client = openreview.api.OpenReviewClient(
        baseurl="https://api2.openreview.net",
        username=username,
        password=password,
    )

    schedule = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    updated = 0
    missing = []

    for index, paper in enumerate(schedule["papers"], start=1):
        note = client.get_note(forum_id(paper["openreviewUrl"]))
        names = content_value(note.content.get("authors")) or []
        author_ids = content_value(note.content.get("authorids")) or []

        if not names or len(names) != len(author_ids):
            missing.append(paper["submissionNumber"])
        else:
            paper["authors"] = [
                {"name": name, "profileUrl": profile_url(author_id)}
                for name, author_id in zip(names, author_ids)
            ]
            paper["authorsSource"] = "OpenReview"
            paper["authorsMatchScore"] = 1
            updated += 1

        print(f"[{index:3}/{len(schedule['papers'])}] Paper {paper['submissionNumber']}: {len(names)} authors")

    schedule["authorMatchCount"] = updated
    print(f"Resolved {updated}/{len(schedule['papers'])} papers.")
    if missing:
        print("Missing or mismatched author data for papers:", ", ".join(map(str, missing)))

    if args.dry_run:
        print("Dry run: data/papers.json was not changed.")
        return

    temporary_path = DATA_PATH.with_suffix(".json.tmp")
    temporary_path.write_text(f"{json.dumps(schedule, ensure_ascii=False, indent=2)}\n", encoding="utf-8")
    temporary_path.replace(DATA_PATH)
    print(f"Updated {DATA_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
