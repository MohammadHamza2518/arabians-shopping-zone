import os, time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. Desktop Test
    page = browser.new_page(viewport={"width": 1280, "height": 850})
    page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)

    # Scroll down to Trending section
    page.locator("text=Trending Customer Favorites").scroll_into_view_if_needed()
    time.sleep(0.5)

    # Check products count initially (should be 8)
    cards = page.locator("div.grid-cols-2 > div, div.grid-cols-3 > div, div.grid-cols-4 > div")
    print("Initial cards visible:", cards.count())

    load_more_btn = page.locator("button:has-text('Load More')").first
    assert load_more_btn.is_visible(), "Load more button should be visible"

    page.screenshot(path=os.path.join(brain_dir, "v20_home_pagination_desktop_8items.png"))
    print("Saved v20_home_pagination_desktop_8items.png")

    # Click Load More
    load_more_btn.click()
    time.sleep(0.5)
    page.screenshot(path=os.path.join(brain_dir, "v20_home_pagination_desktop_16items.png"))
    print("Saved v20_home_pagination_desktop_16items.png")

    # 2. Mobile View Test
    mob_page = browser.new_page(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True)
    mob_page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)
    mob_page.locator("text=Trending Customer Favorites").scroll_into_view_if_needed()
    time.sleep(0.5)
    mob_page.screenshot(path=os.path.join(brain_dir, "v20_home_pagination_mobile.png"))
    print("Saved v20_home_pagination_mobile.png")

    browser.close()
    print("Home pagination tests completed successfully!")
