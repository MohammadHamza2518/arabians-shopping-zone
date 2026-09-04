from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # 1. Desktop full page
    desk_page = browser.new_page(viewport={"width": 1280, "height": 900})
    desk_page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    desk_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/full_home_desktop.png", full_page=True)
    print("Saved full_home_desktop.png")

    # 2. Mobile full page
    mob_page = browser.new_page(viewport={"width": 390, "height": 844})
    mob_page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    mob_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/full_home_mobile.png", full_page=True)
    print("Saved full_home_mobile.png")

    browser.close()
