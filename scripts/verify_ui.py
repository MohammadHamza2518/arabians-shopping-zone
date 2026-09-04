import os
import time
from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"
os.makedirs(artifact_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. Desktop Viewport
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:5000", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(artifact_dir, "desktop_home.png"), full_page=True)
    print("Saved desktop_home.png")

    # 2. Mobile Viewport (iPhone 14 Pro: 393 x 852)
    mobile_page = browser.new_page(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True)
    mobile_page.goto("http://localhost:5000", wait_until="networkidle")
    time.sleep(1)
    mobile_page.screenshot(path=os.path.join(artifact_dir, "mobile_home.png"), full_page=False)
    print("Saved mobile_home.png")

    # 3. Mobile Product Modal
    mobile_page.click("text=Quick View", timeout=5000)
    time.sleep(1)
    mobile_page.screenshot(path=os.path.join(artifact_dir, "mobile_product_modal.png"))
    print("Saved mobile_product_modal.png")

    # 4. Admin Dashboard
    admin_page = browser.new_page(viewport={"width": 1280, "height": 800})
    admin_page.goto("http://localhost:5000", wait_until="networkidle")
    # Click Admin button
    admin_page.click("button[title='Admin Panel Login']")
    time.sleep(1)
    # Enter PIN
    admin_page.fill("input[placeholder='Enter Store Passcode']", "arabians786")
    admin_page.click("text=Unlock Admin Dashboard")
    time.sleep(1.5)
    admin_page.screenshot(path=os.path.join(artifact_dir, "admin_dashboard.png"))
    print("Saved admin_dashboard.png")

    # 5. Mobile Tracking Modal
    track_page = browser.new_page(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True)
    track_page.goto("http://localhost:5000", wait_until="networkidle")
    track_page.click("button[title='Track Your Order']")
    time.sleep(1)
    track_page.screenshot(path=os.path.join(artifact_dir, "mobile_track_order.png"))
    print("Saved mobile_track_order.png")

    browser.close()
    print("All UI test screenshots captured successfully!")
