from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # Scroll to spotlight
    section = page.locator("#talbina-spotlight")
    section.scroll_into_view_if_needed()
    time.sleep(1)

    tabs = page.locator("#talbina-spotlight div button")
    count = tabs.count()
    print("Found tabs:", count)

    for i in range(min(count, 5)):
        tab_btn = tabs.nth(i)
        tab_name = tab_btn.inner_text().strip()
        print(f"Clicking tab {i}: {tab_name}")
        tab_btn.click()
        time.sleep(1.5)

        # Scroll so the product card is centered
        card = page.locator("#talbina-spotlight .lg\\:col-span-5")
        card.scroll_into_view_if_needed()
        time.sleep(0.5)

        filename = f"C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/talbina_tab_{i}_mobile.png"
        page.screenshot(path=filename)
        print(f"Saved {filename}")

    browser.close()
