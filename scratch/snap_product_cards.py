from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 390, "height": 844})
    page.goto('http://localhost:3000/#/shop?category=health', timeout=20000, wait_until='domcontentloaded')
    time.sleep(2)

    # Scroll to the product grid
    page.evaluate("window.scrollTo(0, 300)")
    time.sleep(1)

    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/product_card_mobile_fullbleed.png")
    print("Saved product_card_mobile_fullbleed.png")

    # Also capture single product card
    first_card = page.locator("[data-testid='product-card']").first
    first_card.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/single_product_card.png")
    print("Saved single_product_card.png")

    b.close()
