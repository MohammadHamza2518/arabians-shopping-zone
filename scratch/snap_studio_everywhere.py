from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 390, "height": 844})

    # 1. Product Detail Page
    page.goto('http://localhost:3000/#/product/talbina-vanilla', timeout=20000, wait_until='domcontentloaded')
    time.sleep(2)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/detail_page_studio_mobile.png")
    print("Saved detail_page_studio_mobile.png")

    # 2. Shop Page
    page.goto('http://localhost:3000/#/shop?category=health', timeout=20000, wait_until='domcontentloaded')
    time.sleep(2)
    page.evaluate("window.scrollTo(0, 320)")
    time.sleep(1)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/shop_grid_studio_mobile.png")
    print("Saved shop_grid_studio_mobile.png")

    # 3. Home Page Spotlight
    page.goto('http://localhost:3000/#/', timeout=20000, wait_until='domcontentloaded')
    time.sleep(2)
    card = page.locator("#talbina-spotlight .lg\\:col-span-5")
    card.scroll_into_view_if_needed()
    time.sleep(1)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/home_spotlight_studio_mobile.png")
    print("Saved home_spotlight_studio_mobile.png")

    b.close()
