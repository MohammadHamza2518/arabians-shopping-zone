import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # Scroll to collections
    page.locator("text=Sacred Sunnah Collections").first.scroll_into_view_if_needed()
    time.sleep(1)

    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/collections_aspect_square_mobile.png")
    print("Saved collections_aspect_square_mobile.png")

    browser.close()
