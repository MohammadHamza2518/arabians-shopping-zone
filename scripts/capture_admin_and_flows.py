import os
import time
from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\moham\Downloads\arabians shopping zone\public\assets\screenshots"
os.makedirs(artifact_dir, exist_ok=True)
brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. Admin Dashboard
    page = browser.new_page(viewport={"width": 1280, "height": 850})
    page.goto("http://localhost:5000", wait_until="networkidle")
    
    # Open Admin
    page.click("button[title='Admin Panel Login']")
    time.sleep(0.5)
    page.fill("input[placeholder='Enter Store Passcode']", "arabians786")
    page.click("text=Unlock Admin Dashboard")
    time.sleep(1)
    
    # Screenshot Orders tab
    admin_path = os.path.join(brain_dir, "admin_orders.png")
    page.screenshot(path=admin_path)
    print("Saved admin_orders.png")

    # Click Products tab in Admin
    page.click("text=Products CRUD")
    time.sleep(0.5)
    page.screenshot(path=os.path.join(brain_dir, "admin_products.png"))
    print("Saved admin_products.png")

    # 2. Live Order Tracking Modal
    track_page = browser.new_page(viewport={"width": 1280, "height": 850})
    track_page.goto("http://localhost:5000", wait_until="networkidle")
    track_page.click("button[title='Track Your Order']")
    time.sleep(1)
    track_page.screenshot(path=os.path.join(brain_dir, "order_tracking_modal.png"))
    print("Saved order_tracking_modal.png")

    # 3. Checkout Modal
    cart_page = browser.new_page(viewport={"width": 1280, "height": 850})
    cart_page.goto("http://localhost:5000", wait_until="networkidle")
    # Click Instant Order Now on Talbina Spotlight
    cart_page.click("text=Instant Order Now")
    time.sleep(1)
    cart_page.screenshot(path=os.path.join(brain_dir, "checkout_page.png"))
    print("Saved checkout_page.png")

    # 4. Become a Distributor Modal
    dist_page = browser.new_page(viewport={"width": 1280, "height": 850})
    dist_page.goto("http://localhost:5000", wait_until="networkidle")
    dist_page.click("text=Distributor Program")
    time.sleep(1)
    dist_page.screenshot(path=os.path.join(brain_dir, "distributor_portal.png"))
    print("Saved distributor_portal.png")

    browser.close()
    print("Captured all feature screenshots!")
