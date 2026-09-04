from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})

    print("Taking screenshot of Contact page...")
    page.goto("http://localhost:3000/#/contact", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/contact_clean_header.png")
    print("Saved contact_clean_header.png")

    print("Taking screenshot of Shop/Catalog page...")
    page.goto("http://localhost:3000/#/shop", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/shop_catalog_clean.png")
    print("Saved shop_catalog_clean.png")

    browser.close()
