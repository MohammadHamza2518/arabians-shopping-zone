import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # Scroll directly to the left box of talbina-spotlight
    el = page.locator("#talbina-spotlight .lg\\:col-span-5").first
    el.scroll_into_view_if_needed()
    time.sleep(1)

    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/talbina_card_perfect_mobile.png")
    print("Saved talbina_card_perfect_mobile.png")

    # Click Royal Milk Mawa
    page.locator("#talbina-spotlight button:has-text('Royal Milk Mawa')").click()
    time.sleep(1)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/talbina_milk_mawa_perfect_mobile.png")
    print("Saved talbina_milk_mawa_perfect_mobile.png")

    browser.close()
