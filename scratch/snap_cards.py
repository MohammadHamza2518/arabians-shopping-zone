import asyncio, os
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        page = await b.new_page(viewport={'width': 1280, 'height': 900})
        await page.goto('http://localhost:3000/#/reviews', wait_until='networkidle')
        out = r"C:\Users\moham\.gemini\antigravity\brain\26f9459c-d96e-45f1-9b55-3425b9aedb3e"
        
        # Click Hindi
        await page.locator("button:has-text('हिन्दी')").click()
        await page.wait_for_timeout(500)
        await page.locator('#reviews-grid').scroll_into_view_if_needed()
        await page.screenshot(path=os.path.join(out, "cards_hindi_scrolled.png"))

        # Click Urdu
        await page.locator("button:has-text('اردو')").click()
        await page.wait_for_timeout(500)
        await page.locator('#reviews-grid').scroll_into_view_if_needed()
        await page.screenshot(path=os.path.join(out, "cards_urdu_scrolled.png"))
        
        await b.close()

if __name__ == '__main__':
    asyncio.run(run())
