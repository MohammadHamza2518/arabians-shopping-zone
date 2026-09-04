from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # Desktop
    desk_page = browser.new_page(viewport={"width": 1280, "height": 900})
    desk_page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    desk_page.locator("text=THE 4 SACRED GATES").scroll_into_view_if_needed()
    time.sleep(1)
    desk_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/vault_doors_desktop.png")
    print("Saved vault_doors_desktop.png")

    # Mobile
    mob_page = browser.new_page(viewport={"width": 390, "height": 844})
    mob_page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    mob_page.locator("text=THE 4 SACRED GATES").scroll_into_view_if_needed()
    time.sleep(1)
    mob_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/vault_doors_mobile.png")
    print("Saved vault_doors_mobile.png")

    browser.close()
