import asyncio
import os
import sys

# Ensure UTF-8 output on Windows console
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 900})
        page = await context.new_page()

        print("1. Navigating to Home Page...")
        await page.goto("http://localhost:3000", wait_until="networkidle")

        # Scroll to reviews section on homepage
        reviews_section = page.locator("#reviews-section")
        await reviews_section.scroll_into_view_if_needed()
        await page.wait_for_timeout(1000)

        # Verify initial cards on home
        cards = page.locator("#reviews-cards-grid > div")
        count = await cards.count()
        print(f"Homepage visible reviews: {count}")
        assert count == 4, f"Expected 4 reviews on homepage, got {count}"

        out_dir = r"C:\Users\moham\.gemini\antigravity\brain\26f9459c-d96e-45f1-9b55-3425b9aedb3e"

        # Check and click "View All"
        view_all_btn = page.locator("#reviews-section button:has-text('View All')")
        btn_text = await view_all_btn.inner_text()
        print(f"View All button text: '{btn_text}'")
        assert "328" in btn_text, f"Expected 328 in View All button, got {btn_text}"

        print("2. Clicking 'View All' to navigate to dedicated reviews page...")
        await view_all_btn.click()
        await page.wait_for_timeout(1000)

        current_url = page.url
        print(f"Current URL after navigation: {current_url}")
        assert "reviews" in current_url, f"Expected URL to contain 'reviews', got {current_url}"

        # 3. Verify Dedicated Reviews Page
        page_title = await page.locator("h1").inner_text()
        print(f"Dedicated Page Title: '{page_title}'")
        assert "Verified Customer Reviews" in page_title

        # Check total count in analytics hub
        score_text = await page.locator("text=Based on").inner_text()
        print(f"Score text: {score_text}")
        assert "328+" in score_text

        # Capture full dedicated reviews page initial view
        await page.screenshot(path=os.path.join(out_dir, "dedicated_reviews_page_desktop.png"))
        print("Captured dedicated_reviews_page_desktop.png")

        # 4. Test Language Filter Tabs
        print("Testing Language Filters...")
        
        # Test Hindi tab
        hindi_tab = page.locator("button:has-text('हिन्दी')")
        assert await hindi_tab.count() > 0, "Hindi tab should exist"
        await hindi_tab.click()
        await page.wait_for_timeout(500)
        first_hindi_comment = await page.locator("#reviews-grid > div:first-child p").inner_text()
        print(f"First Hindi comment sample: {first_hindi_comment[:60]}...")
        assert "तल्बीना" in first_hindi_comment or "सऊदी" in first_hindi_comment or "देहनुल" in first_hindi_comment or "खुशबू" in first_hindi_comment, "Should contain Hindi Devanagari text"
        await page.screenshot(path=os.path.join(out_dir, "reviews_language_hindi.png"))
        print("Captured reviews_language_hindi.png")

        # Test Urdu tab
        urdu_tab = page.locator("button:has-text('اردو')")
        assert await urdu_tab.count() > 0, "Urdu tab should exist"
        await urdu_tab.click()
        await page.wait_for_timeout(500)
        first_urdu_comment = await page.locator("#reviews-grid > div:first-child p").inner_text()
        print(f"First Urdu comment sample: {first_urdu_comment[:60]}...")
        assert any(c in first_urdu_comment for c in ["تلبینہ", "ماشاءاللہ", "سنت", "خوشبو", "ثوب", "سعودی"]), "Should contain Urdu text"
        await page.screenshot(path=os.path.join(out_dir, "reviews_language_urdu.png"))
        print("Captured reviews_language_urdu.png")

        # Test Hinglish tab
        hinglish_tab = page.locator("button:has-text('Hinglish')")
        await hinglish_tab.click()
        await page.wait_for_timeout(500)
        first_hinglish_comment = await page.locator("#reviews-grid > div:first-child p").inner_text()
        print(f"First Hinglish comment sample: {first_hinglish_comment[:60]}...")
        await page.screenshot(path=os.path.join(out_dir, "reviews_language_hinglish.png"))
        print("Captured reviews_language_hinglish.png")

        # Reset to All Languages
        all_lang_tab = page.locator("button:has-text('All Languages')")
        await all_lang_tab.click()
        await page.wait_for_timeout(500)

        # 5. Test Search
        print("Testing Search functionality...")
        search_input = page.locator("input[placeholder*='Search reviews']")
        await search_input.fill("Hyderabad")
        await page.wait_for_timeout(600)
        search_cards = page.locator("#reviews-grid > div")
        search_count = await search_cards.count()
        print(f"Reviews found for 'Hyderabad': {search_count}")
        assert search_count > 0, "Should find Hyderabad reviews"

        await search_input.fill("")
        await page.wait_for_timeout(600)

        # 6. Test Category Filter
        talbina_cat = page.locator("button:has-text('Sunnah Talbina')")
        await talbina_cat.click()
        await page.wait_for_timeout(500)
        talbina_card_product = await page.locator("#reviews-grid > div:first-child strong").inner_text()
        print(f"Product in Talbina filter: {talbina_card_product}")
        assert "Talbeena" in talbina_card_product or "Talbina" in talbina_card_product

        # 7. Test Pagination
        all_cat = page.locator("button:has-text('All Categories')")
        await all_cat.click()
        await page.wait_for_timeout(500)

        page_2_btn = page.locator("button:text-is('2')")
        if await page_2_btn.count() > 0:
            print("Clicking Page 2...")
            await page_2_btn.click()
            await page.wait_for_timeout(500)
            page_text = await page.locator("text=Page 2 of").inner_text()
            print(f"Pagination indicator: {page_text}")
            assert "Page 2" in page_text

        # 8. Test Write a Review on dedicated page
        print("Testing Write a Review modal on dedicated page...")
        write_btn = page.locator("button:has-text('Write a Review')").first
        await write_btn.click()
        await page.wait_for_timeout(500)
        modal = page.locator(".fixed.inset-0.z-50")
        assert await modal.count() > 0, "Write modal should be visible"
        await page.screenshot(path=os.path.join(out_dir, "reviews_page_modal_open.png"))
        print("Captured reviews_page_modal_open.png")

        # Close modal
        close_btn = modal.locator("button:has-text('✕') , button > svg.lucide-x").first
        await close_btn.click()
        await page.wait_for_timeout(400)

        # 9. Test Mobile Viewport
        print("Testing mobile viewport...")
        await page.set_viewport_size({'width': 375, 'height': 812})
        await page.goto("http://localhost:3000/#/reviews", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        await page.screenshot(path=os.path.join(out_dir, "dedicated_reviews_page_mobile.png"))
        print("Captured dedicated_reviews_page_mobile.png")

        print("=== ALL DEDICATED REVIEWS TESTS COMPLETED SUCCESSFULLY ===")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
