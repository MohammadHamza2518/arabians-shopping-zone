from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    # 1. Mobile Wearing
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://localhost:3000/#/shop?category=wearing", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    page.evaluate("window.scrollBy(0, 320)")
    time.sleep(1)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/improved_wearing_mobile.png")
    print("Saved improved_wearing_mobile.png")

    # 2. Desktop Wearing
    desk_page = browser.new_page(viewport={"width": 1280, "height": 900})
    desk_page.goto("http://localhost:3000/#/shop?category=wearing", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    desk_page.evaluate("window.scrollBy(0, 380)")
    time.sleep(1)
    desk_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/improved_wearing_desktop.png")
    print("Saved improved_wearing_desktop.png")

    # 3. Mobile Health (Talbina)
    page.goto("http://localhost:3000/#/shop?category=health", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    page.evaluate("window.scrollBy(0, 320)")
    time.sleep(1)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/improved_health_mobile.png")
    print("Saved improved_health_mobile.png")

    browser.close()
