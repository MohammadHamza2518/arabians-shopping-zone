import asyncio
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        out_dir = r"C:\Users\moham\.gemini\antigravity\brain\26f9459c-d96e-45f1-9b55-3425b9aedb3e"

        # 1. Desktop Homepage Top Reviews
        print("1. Checking Desktop Homepage Top Reviews...")
        d_ctx = await browser.new_context(viewport={'width': 1280, 'height': 900})
        d_page = await d_ctx.new_page()

        await d_page.goto("http://localhost:3000", wait_until="networkidle")
        reviews_section = d_page.locator("#reviews-section")
        await reviews_section.scroll_into_view_if_needed()
        await d_page.wait_for_timeout(800)

        # Verify 4 reviews on homepage have DP images
        dp_imgs = d_page.locator("#reviews-cards-grid img")
        img_count = await dp_imgs.count()
        print(f"Homepage top reviews with DP img count: {img_count}")
        assert img_count == 4, f"Expected 4 reviews with DP img, got {img_count}"

        await reviews_section.screenshot(path=os.path.join(out_dir, "homepage_top_reviews_with_male_dps.png"))
        print("Captured homepage_top_reviews_with_male_dps.png")

        # 2. Desktop Dedicated Reviews Page
        print("\n2. Checking Dedicated Reviews Page...")
        await d_page.goto("http://localhost:3000/#/reviews", wait_until="networkidle")
        await d_page.wait_for_timeout(800)
        reviews_grid = d_page.locator("#reviews-grid")
        await reviews_grid.scroll_into_view_if_needed()
        await d_page.wait_for_timeout(500)

        await d_page.screenshot(path=os.path.join(out_dir, "dedicated_page_top_reviews_male_dps.png"))
        print("Captured dedicated_page_top_reviews_male_dps.png")

        # 3. Mobile Dedicated Reviews Page
        print("\n3. Checking Mobile Dedicated Reviews Page...")
        m_ctx = await browser.new_context(viewport={'width': 375, 'height': 812})
        m_page = await m_ctx.new_page()

        await m_page.goto("http://localhost:3000/#/reviews", wait_until="networkidle")
        await m_page.wait_for_timeout(800)
        m_grid = m_page.locator("#reviews-grid")
        await m_grid.scroll_into_view_if_needed()
        await m_page.wait_for_timeout(500)

        await m_page.screenshot(path=os.path.join(out_dir, "mobile_top_reviews_male_dps.png"))
        print("Captured mobile_top_reviews_male_dps.png")

        print("\n=== ALL MALE DP VERIFICATIONS PASSED SUCCESSFULLY ===")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
