import urllib.request
import json
from playwright.sync_api import sync_playwright
import time

base_url = "http://localhost:3000"

# Step 1: Add a new product via the API
new_prod_payload = {
    "name": "Special Admin Added Royal Gold Thobe",
    "category": "wearing",
    "price": 8999,
    "mrp": 11999,
    "rating": 5.0,
    "reviewsCount": 999,
    "badge": "VIP Royal Edition",
    "image": "/assets/studio/mens_white_thobe.jpg",
    "description": "Premium test thobe added via Admin"
}

req = urllib.request.Request(
    f"{base_url}/api/products",
    data=json.dumps(new_prod_payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

with urllib.request.urlopen(req) as resp:
    res_data = json.loads(resp.read().decode('utf-8'))

created_id = res_data.get("id") or res_data.get("product", {}).get("id")
print("Created Test Product ID:", created_id)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.goto("http://localhost:3000/#/shop?category=wearing", timeout=20000, wait_until="domcontentloaded")
        time.sleep(2)

        def get_card_prices():
            cards = page.locator("[data-testid='product-card']").all()
            return [float(c.get_attribute("data-price")) for c in cards]

        def get_card_ratings():
            cards = page.locator("[data-testid='product-card']").all()
            return [float(c.get_attribute("data-rating")) for c in cards]

        # 1. Test Price: High to Low
        sort_trigger = page.locator("[data-testid='sort-trigger']")
        sort_trigger.click()
        time.sleep(0.5)
        page.locator("button[role='option']:has-text('Price: High to Low')").click()
        time.sleep(1)

        high_prices = get_card_prices()
        print("High to Low Prices with NEW product:", high_prices)
        assert high_prices[0] == 8999.0, f"Expected 8999 at index 0, got {high_prices[0]}"
        assert high_prices == sorted(high_prices, reverse=True)
        print("SUCCESS: New Product correctly tops 'Price: High to Low'!")

        # 2. Test Price: Low to High
        sort_trigger.click()
        time.sleep(0.5)
        page.locator("button[role='option']:has-text('Price: Low to High')").click()
        time.sleep(1)

        low_prices = get_card_prices()
        print("Low to High Prices with NEW product:", low_prices)
        assert low_prices[-1] == 8999.0, f"Expected 8999 at last index, got {low_prices[-1]}"
        assert low_prices == sorted(low_prices)
        print("SUCCESS: New Product correctly placed at end of 'Price: Low to High'!")

        # 3. Test Highest Rated
        sort_trigger.click()
        time.sleep(0.5)
        page.locator("button[role='option']:has-text('Highest Rated')").click()
        time.sleep(1)

        ratings = get_card_ratings()
        print("Ratings with NEW product:", ratings)
        assert ratings == sorted(ratings, reverse=True)
        print("SUCCESS: Rating sort verified!")

        # Take a screenshot proof!
        page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/new_product_sorting_proof.png")
        print("Saved new_product_sorting_proof.png")

        browser.close()

finally:
    # Always cleanup all test products
    clean_req = urllib.request.Request(f"{base_url}/api/products")
    with urllib.request.urlopen(clean_req) as clean_resp:
        all_prods = json.loads(clean_resp.read().decode('utf-8'))
    for p in all_prods:
        if "Special Admin Added" in p.get("name", ""):
            del_req = urllib.request.Request(f"{base_url}/api/products/{p['id']}", method='DELETE')
            with urllib.request.urlopen(del_req) as del_resp:
                print("Cleaned test item:", p['id'])

print("\n>>> CONFIRMED: 100% OPERATIONAL WITH NEW ADMIN PRODUCTS! <<<")
