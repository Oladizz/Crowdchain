from playwright.sync_api import sync_playwright, Page, expect
import time

def run_test(page: Page):
    """
    This test verifies that the application loads correctly after
    fixing the missing updateDoc import.
    """
    # 1. Arrange: Go to the application's homepage.
    page.goto("http://localhost:3000")

    # Wait for a fixed amount of time for animations and data to load.
    time.sleep(5)

    # 2. Assert: Confirm the main content is visible.
    # We expect to find a heading with the text "Spotlight Projects".
    expect(page.get_by_role("heading", name="Spotlight Projects")).to_be_visible()

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    try:
        run_test(page)
    finally:
        browser.close()