import os, time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)

    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(0.5)

    block = page.locator("footer .lg\\:col-span-4").first
    block.screenshot(path=os.path.join(brain_dir, "v11_footer_block1.png"))
    print("Saved v11_footer_block1.png")

    browser.close()
