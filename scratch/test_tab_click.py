from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 390, "height": 844})
    page.on('console', lambda m: print('CONSOLE:', m.text))
    page.on('pageerror', lambda e: print('ERROR:', e))
    page.goto('http://localhost:3000/#/')
    page.wait_for_timeout(2000)

    # Click Royal Milk Mawa
    btn = page.locator("#talbina-spotlight button").filter(has_text="Royal Milk Mawa")
    btn.click()
    page.wait_for_timeout(2000)

    img = page.locator("#talbina-spotlight img").first
    print("SRC:", img.get_attribute("src"))
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/milk_mawa_clicked_success.png")
    print("Saved milk_mawa_clicked_success.png")
    b.close()
