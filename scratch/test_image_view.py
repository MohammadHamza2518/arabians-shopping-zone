from playwright.sync_api import sync_playwright
import time

# Let's inspect the current shop page rendering
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://localhost:3000/#/shop?category=wearing", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    page.evaluate("window.scrollBy(0, 320)")
    time.sleep(1)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/current_wearing_test.png")
    print("Saved current_wearing_test.png")
    browser.close()
