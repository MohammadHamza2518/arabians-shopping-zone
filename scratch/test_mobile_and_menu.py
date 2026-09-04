import asyncio
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        out_dir = r"C:\Users\moham\.gemini\antigravity\brain\26f9459c-d96e-45f1-9b55-3425b9aedb3e"

        # ==========================================================
        # 1. MOBILE TESTS (375x812 iPhone Viewport)
        # ==========================================================
        print("1. Launching Mobile Context (375x812)...")
        m_ctx = await browser.new_context(viewport={'width': 375, 'height': 812})
        m_page = await m_ctx.new_page()

        print("Navigating to http://localhost:3000/#/reviews on mobile...")
        await m_page.goto("http://localhost:3000/#/reviews", wait_until="networkidle")
        await m_page.wait_for_timeout(1000)

        # Check Horizontal Overflow
        scroll_width = await m_page.evaluate("() => document.documentElement.scrollWidth")
        inner_width = await m_page.evaluate("() => window.innerWidth")
        print(f"Mobile Check: innerWidth = {inner_width}, scrollWidth = {scroll_width}")
        assert scroll_width <= inner_width + 1, f"Horizontal overflow detected! scrollWidth ({scroll_width}) > innerWidth ({inner_width})"

        # Screenshot mobile reviews page top (Header + Analytics Hub)
        await m_page.screenshot(path=os.path.join(out_dir, "mobile_reviews_fixed_top.png"))
        print("Captured mobile_reviews_fixed_top.png")

        # Scroll to Controls (Search + Filters)
        controls = m_page.locator("input[placeholder*='Search by keyword']")
        await controls.scroll_into_view_if_needed()
        await m_page.wait_for_timeout(500)
        await m_page.screenshot(path=os.path.join(out_dir, "mobile_reviews_fixed_controls.png"))
        print("Captured mobile_reviews_fixed_controls.png")

        # Scroll to Cards
        card = m_page.locator("#reviews-grid > div:first-child")
        await card.scroll_into_view_if_needed()
        await m_page.wait_for_timeout(500)
        await m_page.screenshot(path=os.path.join(out_dir, "mobile_reviews_fixed_cards.png"))
        print("Captured mobile_reviews_fixed_cards.png")

        # Open Write a Review Modal on mobile
        print("Testing Write a Review modal on mobile...")
        write_btn = m_page.locator("button:has-text('Write a Review')").first
        await write_btn.click()
        await m_page.wait_for_timeout(600)
        await m_page.screenshot(path=os.path.join(out_dir, "mobile_reviews_modal_dp.png"))
        print("Captured mobile_reviews_modal_dp.png")

        # Close Modal
        close_btn = m_page.locator(".fixed.inset-0.z-50 button").first
        await close_btn.click()
        await m_page.wait_for_timeout(400)

        # Test Mobile Menu Drawer
        print("Testing Mobile Menu Drawer for Reviews link...")
        await m_page.goto("http://localhost:3000", wait_until="networkidle")
        await m_page.wait_for_timeout(500)
        menu_btn = m_page.locator("button[aria-label='Toggle menu']")
        await menu_btn.click()
        await m_page.wait_for_timeout(600)

        # Verify Verified Reviews link is visible in mobile drawer
        reviews_menu_link = m_page.locator("a:has-text('Verified Customer Reviews')")
        assert await reviews_menu_link.count() > 0, "Reviews link should be in mobile drawer menu"
        print("Found 'Verified Customer Reviews' in mobile drawer menu!")
        await m_page.screenshot(path=os.path.join(out_dir, "mobile_header_menu_drawer.png"))
        print("Captured mobile_header_menu_drawer.png")

        # Click the link from mobile drawer
        await reviews_menu_link.first.click()
        await m_page.wait_for_timeout(800)
        print(f"URL after mobile drawer click: {m_page.url}")
        assert "reviews" in m_page.url

        # ==========================================================
        # 2. DESKTOP TESTS (1280x900)
        # ==========================================================
        print("\n2. Launching Desktop Context (1280x900)...")
        d_ctx = await browser.new_context(viewport={'width': 1280, 'height': 900})
        d_page = await d_ctx.new_page()

        await d_page.goto("http://localhost:3000", wait_until="networkidle")
        await d_page.wait_for_timeout(500)

        # Verify desktop header has Reviews link
        desktop_reviews_link = d_page.locator("header a:has-text('Reviews')")
        assert await desktop_reviews_link.count() > 0, "Desktop header should have Reviews link"
        print("Desktop Header has 'Reviews' button!")
        await d_page.screenshot(path=os.path.join(out_dir, "desktop_header_with_reviews.png"))
        print("Captured desktop_header_with_reviews.png")

        await desktop_reviews_link.click()
        await d_page.wait_for_timeout(800)
        print(f"Desktop URL after click: {d_page.url}")
        assert "reviews" in d_page.url

        print("\n=== ALL MOBILE AND MENU TESTS COMPLETED SUCCESSFULLY ===")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
