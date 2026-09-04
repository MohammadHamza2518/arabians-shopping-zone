import os
import time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 850})

    # Track Order ASZ-1089
    page.goto("http://localhost:5000/#/track?query=ASZ-1089", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "v2_dedicated_track_verified.png"))
    print("Saved v2_dedicated_track_verified.png")

    # Admin Dashboard
    page.goto("http://localhost:5000/#/admin", wait_until="networkidle")
    page.fill("input[type='password']", "arabians786")
    page.click("text=Unlock Admin Dashboard")
    time.sleep(1.5)
    page.screenshot(path=os.path.join(brain_dir, "v2_dedicated_admin_verified.png"))
    print("Saved v2_dedicated_admin_verified.png")

    browser.close()
    print("FINAL VERIFIED SCREENSHOTS COMPLETE!")
