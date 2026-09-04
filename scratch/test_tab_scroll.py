from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 390, "height": 844})
    page.goto('http://localhost:3000/#/')
    page.wait_for_timeout(2000)

    # Scroll to spotlight
    spotlight = page.locator("#talbina-spotlight")
    spotlight.scroll_into_view_if_needed()
    page.wait_for_timeout(1000)

    # Click Royal Milk Mawa
    btn = page.locator("#talbina-spotlight button").filter(has_text="Royal Milk Mawa")
    btn.click()
    page.wait_for_timeout(1000)

    # Scroll slightly so the box is centered in mobile viewport
    card = page.locator("#talbina-spotlight .lg\\:col-span-5")
    card.scroll_into_view_if_needed()
    page.wait_for_timeout(1000)

    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/milk_mawa_scrolled_confirmed.png")
    print("Saved milk_mawa_scrolled_confirmed.png")
    b.close()
