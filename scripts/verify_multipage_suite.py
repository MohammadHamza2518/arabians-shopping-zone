import os
import time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"
os.makedirs(brain_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. Desktop Home Page
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "v2_desktop_home.png"), full_page=False)
    print("1. Saved v2_desktop_home.png")

    # 2. Mobile Home Page (Clean Proportions)
    mob_page = browser.new_page(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True)
    mob_page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)
    mob_page.screenshot(path=os.path.join(brain_dir, "v2_mobile_home.png"), full_page=False)
    print("2. Saved v2_mobile_home.png")

    # 3. Dedicated Shop Page
    page.goto("http://localhost:5000/#/shop", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "v2_dedicated_shop.png"), full_page=False)
    print("3. Saved v2_dedicated_shop.png")

    # 4. Dedicated Product Detail Page (Men's Royal Thobe with new Studio Photography)
    page.goto("http://localhost:5000/#/product/thobe-saudi-classic-white", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "v2_dedicated_product_thobe.png"), full_page=False)
    print("4. Saved v2_dedicated_product_thobe.png")

    # 5. Dedicated Product Detail Page (Dehnul Oud with new Studio Photography)
    page.goto("http://localhost:5000/#/product/dehnul-oud-pure", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "v2_dedicated_product_oud.png"), full_page=False)
    print("5. Saved v2_dedicated_product_oud.png")

    # 6. Dedicated Checkout Page
    # Add an item to cart first
    page.click("text=Add to Cart")
    time.sleep(0.5)
    page.goto("http://localhost:5000/#/checkout", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "v2_dedicated_checkout.png"), full_page=False)
    print("6. Saved v2_dedicated_checkout.png")

    # 7. Dedicated Order Tracking Page
    page.goto("http://localhost:5000/#/track?query=ASZ-1089", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "v2_dedicated_track.png"), full_page=False)
    print("7. Saved v2_dedicated_track.png")

    # 8. Dedicated Distributor Page
    page.goto("http://localhost:5000/#/distributor", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "v2_dedicated_distributor.png"), full_page=False)
    print("8. Saved v2_dedicated_distributor.png")

    # 9. Dedicated Contact Page
    page.goto("http://localhost:5000/#/contact", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "v2_dedicated_contact.png"), full_page=False)
    print("9. Saved v2_dedicated_contact.png")

    # 10. Dedicated Shipping Policy Page
    page.goto("http://localhost:5000/#/shipping-policy", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "v2_dedicated_shipping.png"), full_page=False)
    print("10. Saved v2_dedicated_shipping.png")

    # 11. Dedicated Admin Page
    admin_page = browser.new_page(viewport={"width": 1280, "height": 850})
    admin_page.goto("http://localhost:5000/#/admin", wait_until="networkidle")
    time.sleep(0.5)
    admin_page.fill("input[placeholder='Enter Store Passcode (arabians786)']", "arabians786")
    admin_page.click("text=Unlock Admin Dashboard")
    time.sleep(1.5)
    admin_page.screenshot(path=os.path.join(brain_dir, "v2_dedicated_admin.png"), full_page=False)
    print("11. Saved v2_dedicated_admin.png")

    browser.close()
    print("ALL 11 DEDICATED PAGE SCREENSHOTS GENERATED CLEANLY!")
