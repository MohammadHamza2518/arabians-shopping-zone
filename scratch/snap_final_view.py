from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 390, "height": 844})
    page.goto('http://localhost:3000/#/', timeout=20000, wait_until='domcontentloaded')
    time.sleep(2)

    # Scroll so that the full card is centered
    card = page.locator("#talbina-spotlight .lg\\:col-span-5")
    card.scroll_into_view_if_needed()
    time.sleep(1)

    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/talbina_card_complete_view.png")
    print("Saved talbina_card_complete_view.png")
    b.close()
