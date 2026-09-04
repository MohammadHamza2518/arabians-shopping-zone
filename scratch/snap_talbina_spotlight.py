import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # Scroll to Talbina spotlight section
    page.locator("#talbina-spotlight").scroll_into_view_if_needed()
    time.sleep(1)

    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/talbina_spotlight_mobile_new.png")
    print("Saved talbina_spotlight_mobile_new.png")

    # Also test clicking the 2nd tab (Milk Mawa) and screenshot
    tabs = page.locator("#talbina-spotlight button")
    if tabs.count() > 1:
        tabs.nth(1).click()
        time.sleep(1)
        page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/talbina_spotlight_milk_mawa_mobile.png")
        print("Saved milk mawa screenshot")

    browser.close()
