from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    # Desktop
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    
    stories_el = page.locator("section[aria-label='Category Stories']")
    stories_el.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/category_stories_desktop.png")
    print("Saved category_stories_desktop.png")

    # Mobile
    mobile_page = browser.new_page(viewport={"width": 390, "height": 844})
    mobile_page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    mobile_stories = mobile_page.locator("section[aria-label='Category Stories']")
    mobile_stories.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/category_stories_mobile.png")
    print("Saved category_stories_mobile.png")

    browser.close()
