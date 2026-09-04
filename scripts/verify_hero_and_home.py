import os
import time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # Desktop Home Top view
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "v3_desktop_home_top.png"))
    print("Saved v3_desktop_home_top.png")

    # Mobile Home Top view (checking header, category bar, and hero)
    mob_page = browser.new_page(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True)
    mob_page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)
    mob_page.screenshot(path=os.path.join(brain_dir, "v3_mobile_home_top.png"))
    print("Saved v3_mobile_home_top.png")

    # Click next slide on Desktop to show second slide (Talbina)
    page.click("button[aria-label='Next Slide']")
    time.sleep(0.5)
    page.screenshot(path=os.path.join(brain_dir, "v3_desktop_slide_talbina.png"))
    print("Saved v3_desktop_slide_talbina.png")

    # Click next slide to show Oud
    page.click("button[aria-label='Next Slide']")
    time.sleep(0.5)
    page.screenshot(path=os.path.join(brain_dir, "v3_desktop_slide_oud.png"))
    print("Saved v3_desktop_slide_oud.png")

    # Scroll down to see new visual category tiles and live tabs
    page.evaluate("window.scrollBy(0, 750)")
    time.sleep(0.8)
    page.screenshot(path=os.path.join(brain_dir, "v3_desktop_home_categories.png"))
    print("Saved v3_desktop_home_categories.png")

    browser.close()
    print("VERIFICATION COMPLETE!")
