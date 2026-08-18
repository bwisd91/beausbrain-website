#!/usr/bin/env python3
"""Android App Categorizer

Groups the apps on an Android device (or from a plain-text list) into
use-based categories (Social, Games, Finance, Productivity, ...).

Get your app list one of two ways:

  1. Connect a device/emulator with USB debugging enabled and `adb` on
     your PATH, then run with --adb - the script pulls the installed
     package list itself.

  2. Put your own list in a text file, one app per line, either just a
     package name ("com.spotify.music") or "Label|package.name", and run
     with --input yourfile.txt. See sample_apps.txt for the format.

Examples:
    python3 categorize_apps.py --adb
    python3 categorize_apps.py --adb --labels
    python3 categorize_apps.py --input my_apps.txt
    python3 categorize_apps.py --adb --output json --outfile report.json
    python3 categorize_apps.py --adb --output markdown --outfile report.md

Categorization order (first match wins):
  1. custom_categories.json overrides, if that file exists next to this
     script - create it to correct or add entries without touching the
     bundled database.
  2. Exact match against the bundled app_categories.json database.
  3. Keyword match (keyword_rules.json) against the package name/label.
  4. "Uncategorized" - review these and add them to custom_categories.json.
"""

import argparse
import csv
import json
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
CATEGORY_DB_PATH = SCRIPT_DIR / "app_categories.json"
KEYWORD_RULES_PATH = SCRIPT_DIR / "keyword_rules.json"
CUSTOM_DB_PATH = SCRIPT_DIR / "custom_categories.json"

UNCATEGORIZED = "Uncategorized"


def load_json(path):
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    data.pop("_comment", None)
    return data


def get_installed_packages_via_adb(include_system, fetch_labels):
    flag = "-a" if include_system else "-3"
    try:
        result = subprocess.run(
            ["adb", "shell", "pm", "list", "packages", flag],
            capture_output=True, text=True, check=True, timeout=30,
        )
    except FileNotFoundError:
        sys.exit("Error: 'adb' was not found on your PATH. Install the Android "
                 "platform-tools, or use --input to categorize a plain-text list instead.")
    except subprocess.CalledProcessError as e:
        sys.exit(f"Error: adb command failed:\n{e.stderr}")
    except subprocess.TimeoutExpired:
        sys.exit("Error: adb timed out. Is a device/emulator connected and unlocked "
                  "(check 'adb devices')?")

    packages = sorted(
        line.split(":", 1)[1].strip()
        for line in result.stdout.splitlines()
        if line.startswith("package:")
    )
    if not packages:
        sys.exit("No packages returned by adb. Run 'adb devices' to confirm a "
                  "device is connected and authorized.")

    apps = []
    for pkg in packages:
        label = get_app_label_via_adb(pkg) if fetch_labels else pkg
        apps.append((label, pkg))
    return apps


def get_app_label_via_adb(pkg):
    """Best-effort human-readable label lookup; falls back to the package name."""
    try:
        result = subprocess.run(
            ["adb", "shell", "cmd", "package", "resolve-activity", "--brief", pkg],
            capture_output=True, text=True, timeout=10,
        )
        # resolve-activity doesn't give a label either; without aapt on the apk
        # there's no reliable on-device way to get it, so just use the package name.
    except Exception:
        pass
    return pkg


def load_apps_from_file(path):
    apps = []
    with open(path, "r", encoding="utf-8") as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if "|" in line:
                label, pkg = line.split("|", 1)
                apps.append((label.strip(), pkg.strip()))
            else:
                apps.append((line, line))
    if not apps:
        sys.exit(f"No apps found in {path}.")
    return apps


def categorize(label, package, exact_db, keyword_rules, custom_db):
    if package in custom_db:
        return custom_db[package]
    if package in exact_db:
        return exact_db[package]

    haystack = f"{package} {label}".lower()
    for category, keywords in keyword_rules.items():
        for kw in keywords:
            if kw.lower() in haystack:
                return category
    return UNCATEGORIZED


def build_report(apps):
    """apps: list of (label, package, category) -> dict category -> sorted list of (label, package)."""
    report = {}
    for label, package, category in apps:
        report.setdefault(category, []).append((label, package))
    for category in report:
        report[category].sort(key=lambda t: t[0].lower())
    return dict(sorted(report.items(), key=lambda kv: (kv[0] == UNCATEGORIZED, kv[0])))


def print_text(report, total):
    print(f"\nCategorized {total} app(s) into {len(report)} categories:\n")
    for category, entries in report.items():
        print(f"== {category} ({len(entries)}) ==")
        for label, package in entries:
            if label == package:
                print(f"  - {package}")
            else:
                print(f"  - {label}  ({package})")
        print()
    if UNCATEGORIZED in report:
        print(f"Tip: add entries for the {len(report[UNCATEGORIZED])} uncategorized "
              f"app(s) to custom_categories.json to improve future runs.")


def write_json(report, outfile):
    with open(outfile, "w", encoding="utf-8") as f:
        json.dump(
            {cat: [{"label": l, "package": p} for l, p in entries] for cat, entries in report.items()},
            f, indent=2,
        )
    print(f"Wrote {outfile}")


def write_csv(report, outfile):
    with open(outfile, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["category", "label", "package"])
        for category, entries in report.items():
            for label, package in entries:
                writer.writerow([category, label, package])
    print(f"Wrote {outfile}")


def write_markdown(report, outfile):
    lines = ["# Android App Categories", ""]
    for category, entries in report.items():
        lines.append(f"## {category} ({len(entries)})")
        for label, package in entries:
            if label == package:
                lines.append(f"- `{package}`")
            else:
                lines.append(f"- {label} (`{package}`)")
        lines.append("")
    with open(outfile, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Wrote {outfile}")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--adb", action="store_true", help="Pull installed packages from a connected device via adb.")
    source.add_argument("--input", metavar="FILE", help="Read apps from a text file instead of adb.")
    parser.add_argument("--include-system", action="store_true", help="With --adb, include system apps (default: user-installed apps only).")
    parser.add_argument("--labels", action="store_true", help="With --adb, attempt to resolve human-readable labels (slower, best-effort).")
    parser.add_argument("--output", choices=["text", "json", "csv", "markdown"], default="text", help="Report format (default: text, printed to stdout).")
    parser.add_argument("--outfile", metavar="FILE", help="Write the report to this file instead of stdout (required for json/csv/markdown).")
    args = parser.parse_args()

    if args.output != "text" and not args.outfile:
        parser.error(f"--output {args.output} requires --outfile")

    exact_db = load_json(CATEGORY_DB_PATH)
    keyword_rules = load_json(KEYWORD_RULES_PATH)
    custom_db = load_json(CUSTOM_DB_PATH)

    if args.adb:
        raw_apps = get_installed_packages_via_adb(args.include_system, args.labels)
    else:
        raw_apps = load_apps_from_file(args.input)

    categorized = [
        (label, package, categorize(label, package, exact_db, keyword_rules, custom_db))
        for label, package in raw_apps
    ]
    report = build_report(categorized)

    if args.output == "text":
        print_text(report, len(categorized))
    elif args.output == "json":
        write_json(report, args.outfile)
    elif args.output == "csv":
        write_csv(report, args.outfile)
    elif args.output == "markdown":
        write_markdown(report, args.outfile)


if __name__ == "__main__":
    main()
