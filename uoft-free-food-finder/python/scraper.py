from __future__ import annotations

import json
import re
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from typing import Iterable
from urllib.request import Request, urlopen

FREE_FOOD = re.compile(
    r"free food|free pizza|free lunch|free snacks?|complimentary|refreshments will be served|food provided",
    re.I,
)
FOOD_TYPES = [
    (re.compile(r"pizza", re.I), "Pizza"),
    (re.compile(r"donuts?", re.I), "Donuts"),
    (re.compile(r"bubble tea|boba", re.I), "Bubble tea"),
    (re.compile(r"snacks?", re.I), "Snacks"),
    (re.compile(r"lunch", re.I), "Full lunch"),
]
DIETARY = [
    (re.compile(r"vegan", re.I), "vegan"),
    (re.compile(r"vegetarian|veggie", re.I), "vegetarian"),
    (re.compile(r"halal", re.I), "halal"),
    (re.compile(r"gluten[-\s]?free|\bgf\b", re.I), "gluten-free"),
]

SOURCES = [
    ("UofT Student Life", "https://www.studentlife.utoronto.ca/events"),
    ("UTSU", "https://www.utsu.ca/events/"),
    ("New College", "https://www.newcollege.utoronto.ca/events/"),
    ("Trinity College", "https://www.trinity.utoronto.ca/events/"),
    ("Victoria College", "https://www.vic.utoronto.ca/news-events/events/"),
    ("University College", "https://www.uc.utoronto.ca/events"),
    ("Innis College", "https://innis.utoronto.ca/events/"),
    ("St. Michael's College", "https://stmikes.utoronto.ca/events"),
]


class TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.chunks: list[str] = []

    def handle_data(self, data: str) -> None:
        text = data.strip()
        if text:
            self.chunks.append(text)


def fetch(url: str) -> str:
    req = Request(url, headers={"User-Agent": "UofT-Free-Food-Finder/1.0"})
    with urlopen(req, timeout=12) as res:
        return res.read().decode("utf-8", errors="ignore")


def classify(text: str) -> dict | None:
    if not FREE_FOOD.search(text):
        return None
    foods = [label for pattern, label in FOOD_TYPES if pattern.search(text)]
    dietary = [label for pattern, label in DIETARY if pattern.search(text)]
    return {
        "foodType": " · ".join(dict.fromkeys(foods)) or "Snacks",
        "dietary": dietary,
    }


def scrape() -> list[dict]:
    events: list[dict] = []
    for host, url in SOURCES:
        try:
            html = fetch(url)
        except Exception as exc:  # noqa: BLE001
            print(f"{host}: skipped ({exc})")
            continue
        extractor = TextExtractor()
        extractor.feed(html)
        blob = "\n".join(extractor.chunks)
        classified = classify(blob[:8000])
        if not classified:
            print(f"{host}: 0 free-food matches")
            continue
        events.append(
            {
                "title": f"{classified['foodType']} event listed on {host}",
                "hostClub": host,
                "description": blob[:500],
                "startAt": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
                "source": "college",
                "sourceUrl": url,
                **classified,
            }
        )
        print(f"{host}: 1 candidate")
    return events


if __name__ == "__main__":
    print(json.dumps(scrape(), indent=2))
