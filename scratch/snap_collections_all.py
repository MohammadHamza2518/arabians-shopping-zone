import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # Scroll slightly more down to see bottom 2 cards
    page.evaluate("window.scrollTo(0, 1100)")
    time.sleep(1)

    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/collections_bottom_916_mobile.png")
    print("Saved collections_bottom_916_mobile.png")

    # Also capture desktop full view
    desk = browser.new_page(viewport={"width": 1280, "height": 900})
    desk.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    desk.evaluate("window.scrollTo(0, 700)")
    time.sleep(1)
    desk.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/collections_916_desktop.png")
    print("Saved collections_916_desktop.png")

    browser.close()
