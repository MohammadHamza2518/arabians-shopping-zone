from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 390, "height": 844})
    page.goto('http://localhost:3000/#/', timeout=20000, wait_until='domcontentloaded')
    time.sleep(3)

    # Scroll to spotlight
    section = page.locator("#talbina-spotlight")
    section.scroll_into_view_if_needed()
    time.sleep(1)

    # Screenshot tab 0 (Vanilla)
    card = page.locator("#talbina-spotlight .lg\\:col-span-5")
    card.scroll_into_view_if_needed()
    time.sleep(0.5)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/talbina_live_tab0_vanilla.png")
    print("Saved tab 0 Vanilla")

    # Click tab 1 (Royal Milk Mawa)
    page.locator("#talbina-spotlight button").filter(has_text="Royal Milk Mawa").click()
    time.sleep(1.5)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/talbina_live_tab1_milkmawa.png")
    print("Saved tab 1 Milk Mawa")

    # Click tab 2 (Kids Chocolate)
    page.locator("#talbina-spotlight button").filter(has_text="Kids Chocolate").click()
    time.sleep(1.5)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/talbina_live_tab2_chocolate.png")
    print("Saved tab 2 Chocolate")

    b.close()
