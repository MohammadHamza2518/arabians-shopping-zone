from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:3000/#/shop?category=wearing", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    cards = page.locator(".group").all()
    print("Found cards:", len(cards))
    for i, c in enumerate(cards):
        print(f"Card {i} text: {repr(c.inner_text())}")
    browser.close()
