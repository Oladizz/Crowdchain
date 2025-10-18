
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")
        page.click('button:has-text("Connect on Base")')
        page.goto("http://localhost:3000/dashboard")
        page.click('button:has-text("Settings")')
        page.fill('input[placeholder="Enter your username"]', 'Jules')
        page.click('button:has-text("Update Profile")')
        page.wait_for_timeout(1000)
        page.screenshot(path="jules-scratch/verification/verification.png")
        browser.close()

run()
