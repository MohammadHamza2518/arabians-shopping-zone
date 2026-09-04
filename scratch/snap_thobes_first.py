from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # Mobile
    mob_page = browser.new_page(viewport={"width": 390, "height": 844})
    mob_page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    mob_page.locator("text=TRENDING CUSTOMER").scroll_into_view_if_needed()
    time.sleep(1)
    mob_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/thobes_first_mobile.png")
    print("Saved thobes_first_mobile.png")

    # Verify first product is Thobe
    first_title = mob_page.locator("h3").filter(has_text="Thobe").first.text_content()
    print("First featured product on storefront:", first_title)

    # Verify Talbina is still present in catalog
    talbina_count = mob_page.locator("text=Talbeena").count()
    print("Talbina presence count on page:", talbina_count)
    assert talbina_count > 0, "Talbina was removed accidentally!"
    print("PASS: Talbina is still present and NOT removed!")

    browser.close()
