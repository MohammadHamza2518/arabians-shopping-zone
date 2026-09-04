import urllib.request
import json
from playwright.sync_api import sync_playwright
import time

# 1. First, test adding a brand new product via API with custom price, rating, and badge
base_url = "http://localhost:5000"
new_prod_payload = {
    "name": "Luxury Test Royal Bisht (Al-Ameer)",
    "category": "wearing",
    "price": 4999,
    "mrp": 6999,
    "rating": 5.0,
    "reviewsCount": 250,
    "badge": "VVIP Special",
    "image": "/assets/studio/mens_white_thobe.jpg",
    "description": "Ultra luxury bisht for testing sort functionality"
}

req = urllib.request.Request(
    f"{base_url}/api/products",
    data=json.dumps(new_prod_payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
with urllib.request.urlopen(req) as response:
    res_data = json.loads(response.read().decode('utf-8'))

print("Create test product response:", res_data.get("success"))
created_id = res_data.get("product", {}).get("id")
print("Created product ID:", created_id)

# 2. Now run browser tests with Playwright to verify all 4 sort modes work with new product!
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:3000/#/shop?category=wearing", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    page.evaluate("window.scrollBy(0, 300)")

    # Test 1: Price High to Low -> Our new product (4999) should be at the top!
    sort_btn = page.locator("button:has-text('Sort: Featured')")
    sort_btn.click()
    time.sleep(0.5)

    high_low_btn = page.locator("button[role='option']:has-text('Price: High to Low')")
    high_low_btn.click()
    time.sleep(1)

    first_card = page.locator(".group").first
    first_title = first_card.locator("a.font-serif").inner_text()
    first_price = first_card.locator("span.font-black").inner_text()
    print("Top product for Price High to Low:", first_title, first_price)
    assert "4999" in first_price, f"Expected 4999 in top product, got {first_price}"
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/test_sort_high_low.png")

    # Test 2: Price Low to High
    sort_btn = page.locator("button:has-text('Price: High to Low')")
    sort_btn.click()
    time.sleep(0.5)

    low_high_btn = page.locator("button[role='option']:has-text('Price: Low to High')")
    low_high_btn.click()
    time.sleep(1)

    first_card = page.locator(".group").first
    first_title = first_card.locator("a.font-serif").inner_text()
    first_price = first_card.locator("span.font-black").inner_text()
    print("Top product for Price Low to High:", first_title, first_price)
    assert "449" in first_price, f"Expected 449 in top product, got {first_price}"
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/test_sort_low_high.png")

    # Test 3: Highest Rated -> Our new product has 5.0 and 250 reviews!
    sort_btn = page.locator("button:has-text('Price: Low to High')")
    sort_btn.click()
    time.sleep(0.5)

    rating_btn = page.locator("button[role='option']:has-text('Highest Rated')")
    rating_btn.click()
    time.sleep(1)

    first_card = page.locator(".group").first
    first_title = first_card.locator("a.font-serif").inner_text()
    print("Top product for Highest Rated:", first_title)
    assert "Luxury Test Royal Bisht" in first_title
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/test_sort_highest_rated.png")

    browser.close()

# Clean up test product
if created_id:
    del_req = urllib.request.Request(f"{base_url}/api/products/{created_id}", method='DELETE')
    with urllib.request.urlopen(del_req) as del_resp:
        print("Cleanup test product response:", json.loads(del_resp.read().decode('utf-8')))

print("ALL SORTING & NEW PRODUCT COMPATIBILITY TESTS PASSED 100%!")
