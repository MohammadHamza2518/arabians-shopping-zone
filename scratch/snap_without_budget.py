from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    page.locator("text=Sacred Sunnah Collections").scroll_into_view_if_needed()
    time.sleep(1)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/home_without_budget.png")
    print("Saved home_without_budget.png")
    browser.close()
