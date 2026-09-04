from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    mob_page = browser.new_page(viewport={"width": 390, "height": 844})
    mob_page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    mob_page.locator("text=TRENDING CUSTOMER").scroll_into_view_if_needed()
    mob_page.evaluate("window.scrollBy(0, 320)")
    time.sleep(1)
    mob_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/thobes_card_details_mobile.png")
    print("Saved thobes_card_details_mobile.png")
    browser.close()
