# Android App Categorizer

A small command-line tool that sorts your Android apps into use-based
categories - Social & Communication, Games, Finance & Banking, Productivity
& Office, and so on - so you can see how your phone breaks down, feed the
groups into home-screen folders, or just find the app you forgot you
installed.

No dependencies beyond Python 3 (standard library only).

## Getting your app list

**Option A - straight from a device (recommended):**

1. Install [Android platform-tools](https://developer.android.com/tools/releases/platform-tools) so `adb` is on your PATH.
2. On your phone: Settings > About phone > tap "Build number" 7 times to enable Developer options, then Settings > Developer options > enable USB debugging.
3. Plug the phone in (or start an emulator), approve the "Allow USB debugging" prompt on the device, and confirm it's visible:
   ```
   adb devices
   ```
4. Run:
   ```
   python3 categorize_apps.py --adb
   ```
   By default this lists only apps you installed (not preloaded system apps). Add `--include-system` to see everything.

**Option B - a plain-text list you type or export yourself:**

Create a text file, one app per line (`Label|package.name`, or just the
package/app name if you don't know the package), and run:
```
python3 categorize_apps.py --input my_apps.txt
```
See `sample_apps.txt` for the format.

## Output

Default is a readable summary printed to the terminal. You can also export:
```
python3 categorize_apps.py --adb --output json     --outfile report.json
python3 categorize_apps.py --adb --output csv       --outfile report.csv
python3 categorize_apps.py --adb --output markdown  --outfile report.md
```

## How categorization works

1. **`custom_categories.json`** (optional, create it yourself next to this script) - your overrides, checked first. Same format as `app_categories.json`: `{"com.example.app": "My Category"}`.
2. **`app_categories.json`** - a bundled database of ~150 well-known apps mapped to categories.
3. **`keyword_rules.json`** - if the exact package isn't known, its package name and label are matched against keyword lists (e.g. anything with "bank" or "wallet" in it lands in Finance & Banking).
4. Anything left over is put in **Uncategorized** so you can review it and, if you want, add it to `custom_categories.json` to improve future runs.

This is a local, offline categorizer - it doesn't call the Play Store or any
network service, so accuracy depends on the bundled database and rules.
Edit the two JSON files (or your own `custom_categories.json`) freely to
tune it for your own apps.

## Note on actually moving app icons

Android has no standard, cross-launcher API for a third-party script to
create home-screen folders or move icons around - that's controlled by
whichever launcher you use and generally requires manual dragging (or
launcher-specific backup/restore features). This tool produces the
categorized *plan*; applying it on your home screen is still a manual step
on stock Android.
