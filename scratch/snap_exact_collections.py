import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # Desktop
    desk = browser.new_page(viewport={"width": 1280, "height": 900})
    desk.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    desk.locator("text=Sacred Sunnah Collections").first.scroll_into_view_if_needed()
    time.sleep(1)
    desk.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/collections_916_desktop_perfect.png")
    print("Saved desktop")

    # Mobile
    mob = browser.new_page(viewport={"width": 390, "height": 844})
    mob.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    mob.locator("text=3D Ayat-ul-Kursi Frames").first.scroll_into_view_if_needed()
    time.sleep(1)
    mob.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/collections_bottom_cards_mobile.png")
    print("Saved mobile bottom")

    browser.close()
