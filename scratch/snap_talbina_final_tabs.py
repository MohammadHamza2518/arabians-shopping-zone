from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 390, "height": 844})
    page.goto('http://localhost:3000/#/', timeout=20000, wait_until='domcontentloaded')
    time.sleep(2)

    # Scroll directly to talbina spotlight
    page.locator("#talbina-spotlight").scroll_into_view_if_needed()
    time.sleep(1)

    # Screenshot tab 0 (Vanilla)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/talbina_tab0_vanilla_final.png")
    print("Saved Vanilla screenshot")

    # Click Royal Milk Mawa
    btn = page.locator("#talbina-spotlight button").filter(has_text="Royal Milk Mawa")
    btn.click()
    time.sleep(1.5)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/talbina_tab1_milmawa_final.png")
    print("Saved Milk Mawa screenshot")

    b.close()
