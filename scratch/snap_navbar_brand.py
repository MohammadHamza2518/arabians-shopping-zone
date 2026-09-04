import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # Mobile view
    mob_page = browser.new_page(viewport={"width": 390, "height": 844})
    mob_page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    # Clip only the top navbar area
    mob_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/navbar_brand_mobile_new.png", clip={"x": 0, "y": 0, "width": 390, "height": 130})
    print("Saved navbar_brand_mobile_new.png")

    # Desktop view
    desk_page = browser.new_page(viewport={"width": 1280, "height": 900})
    desk_page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    desk_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/navbar_brand_desktop_new.png", clip={"x": 0, "y": 0, "width": 1280, "height": 140})
    print("Saved navbar_brand_desktop_new.png")

    browser.close()
