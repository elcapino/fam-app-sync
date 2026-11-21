#!/usr/bin/env python3
"""Pull delayed ADX quotes into hmk-view.json. The public gateway key is read
from www.adx.ae at run time and is never written to the snapshot or stdout.
"""
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SNAPSHOT = ROOT / "app/src/main/assets/hmk/hmk-view.json"
HOME = "https://www.adx.ae/"
BOARD = "https://apigateway.adx.ae/adx/marketwatch-delayed/1.1/securityBoards/mainMarket"
TRADES = "https://apigateway.adx.ae/adx/marketwatch/1.1/recentTrades/{symbol}"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
NAMES = [
    ("ADNOCGAS", "أدنوك للغاز", "ADNOC Gas"),
    ("ADNOCDIST", "أدنوك للتوزيع", "ADNOC Distribution"),
    ("FAB", "بنك أبوظبي الأول", "First Abu Dhabi Bank"),
    ("ALDAR", "الدار العقارية", "Aldar Properties"),
    ("ADIB", "مصرف أبوظبي الإسلامي", "Abu Dhabi Islamic Bank"),
    ("ETISALAT", "إي آند", "e&"),
]


def fetch(url, headers):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=40) as res:
        return res.read()


def site_key():
    html = fetch(HOME, {"User-Agent": UA, "Accept": "text/html"}).decode("utf-8", "replace")
    srcs = re.findall(r'(?:src|href)="([^"]+\.js)"', html)
    urls = []
    for src in srcs:
        if src.startswith("http"):
            urls.append(src)
        elif src.startswith("/"):
            urls.append("https://www.adx.ae" + src)
    # Prefer the app bundle; fall back to every script the page loads.
    urls.sort(key=lambda u: (0 if "/pages/_app-" in u else 1, u))
    for url in urls:
        try:
            text = fetch(url, {"User-Agent": UA, "Accept": "*/*"}).decode("utf-8", "replace")
        except Exception:
            continue
        match = re.search(r'"adx-Gateway-APIKey":"([^"]+)"', text)
        if match:
            return match.group(1)
    raise SystemExit("ADX public client key was not found on www.adx.ae")


def money(value):
    return round(float(value), 2)


def bars_for(symbol, headers):
    payload = json.loads(fetch(TRADES.format(symbol=symbol), headers).decode())
    rows = ((payload.get("response") or {}).get("results")) or []
    bars = []
    for row in rows:
        if not row.get("date"):
            continue
        bars.append({
            "d": row["date"],
            "o": money(row["open"]),
            "h": money(row["high"]),
            "l": money(row["low"]),
            "c": money(row["close"]),
        })
    bars.sort(key=lambda row: row["d"])
    return bars[-10:]


def main():
    key = site_key()
    headers = {
        "Accept": "application/json",
        "Channel-ID": "OSS WEB",
        "adx-Gateway-APIKey": key,
        "User-Agent": UA,
        "Origin": "https://www.adx.ae",
        "Referer": "https://www.adx.ae/",
    }
    board = json.loads(fetch(BOARD, headers).decode())
    by_symbol = {row.get("companySymbol"): row for row in board["response"]["results"]}
    fresh = []
    for symbol, ar, en in NAMES:
        row = by_symbol.get(symbol)
        if not row or row.get("price") is None:
            raise SystemExit("ADX board has no quote for " + symbol)
        bars = bars_for(symbol, headers)
        if len(bars) != 10:
            raise SystemExit("ADX history for " + symbol + " returned " + str(len(bars)) + " bars")
        fresh.append({
            "mkt": "ADX",
            "ar": ar,
            "en": en,
            "sym": symbol,
            "px": money(row["price"]),
            "chg": round(float(row["change"]), 2),
            "cur": "AED",
            "spark": [bar["c"] for bar in bars],
            "bars": bars,
            "src": "ADX delayed",
        })
    data = json.loads(SNAPSHOT.read_text(encoding="utf-8"))
    stocks = [row for row in data["market"]["stocks"] if row.get("mkt") != "ADX"]
    data["market"]["stocks"] = stocks + fresh
    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    if key in text:
        raise SystemExit("refusing to write the snapshot because it contains the gateway key")
    SNAPSHOT.write_text(text, encoding="utf-8")
    print("ADX delayed snapshot updated: " + ", ".join(row["sym"] for row in fresh))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        # Never echo request headers. Status and type are enough.
        print("ADX refresh failed: " + type(exc).__name__, file=sys.stderr)
        if hasattr(exc, "code"):
            print("HTTP " + str(exc.code), file=sys.stderr)
        sys.exit(1)
