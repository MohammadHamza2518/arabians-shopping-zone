import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # Mobile
    mob_page = browser.new_page(viewport={"width": 390, "height": 844})
    mob_page.goto("http://localhost:3000/#/track", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    mob_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/real_track_page_mobile.png", full_page=True)
    print("Saved real_track_page_mobile.png")

    # Verify no 'demo' text exists on the page
    body_text = mob_page.locator("body").inner_text()
    assert "demo" not in body_text.lower(), "Found 'demo' text on page!"
    print("PASS: Verified ZERO 'demo' text on Track Order page!")

    # Desktop
    desk_page = browser.new_page(viewport={"width": 1280, "height": 900})
    desk_page.goto("http://localhost:3000/#/track", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    desk_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/real_track_page_desktop.png")
    print("Saved real_track_page_desktop.png")

    browser.close()
