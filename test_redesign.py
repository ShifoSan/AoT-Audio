import re
from playwright.sync_api import Page, expect

def test_redesign(page: Page):
    page.goto("http://localhost:8080")

    # 1. Verify the "What and Why" section
    what_and_why_section = page.locator(".what-and-why")
    expect(what_and_why_section).to_be_visible()
    expect(what_and_why_section.locator("h2")).to_have_text("A Tribute to the Music of Attack on Titan")

    # 2. Verify the player controls
    player = page.locator(".player")
    expect(player).to_be_visible()

    # 3. Test Credits Modal with the initial track
    credits_btn = player.locator(".info-btn")
    credits_modal = page.locator("#credits-modal")
    expect(credits_modal).not_to_be_visible()
    credits_btn.click()
    expect(credits_modal).to_be_visible()
    expect(credits_modal.locator(".track-title")).to_have_text("Guren no Yumiya") # Initial track from "Openings"
    page.click("body") # Click outside to close
    expect(credits_modal).not_to_be_visible()

    # 4. Test Playlist Modal and switch the playlist
    playlist_btn = player.locator(".playlist-menu-btn")
    playlist_modal = page.locator("#playlist-modal")
    expect(playlist_modal).not_to_be_visible()
    playlist_btn.click()
    expect(playlist_modal).to_be_visible()
    playlist_modal.locator("li[data-playlist='endings']").click()
    expect(playlist_modal).not_to_be_visible() # Modal should close after selection

    # 5. Test Credits Modal again to confirm the track changed
    credits_btn.click()
    expect(credits_modal).to_be_visible()
    expect(credits_modal.locator(".track-title")).to_have_text("Utsukushiki Zankoku na Sekai") # New track from "Endings"
    page.click("body") # Click outside to close

    # 6. Test Volume Modal
    volume_btn = player.locator(".volume-btn")
    volume_modal = page.locator("#volume-modal")
    expect(volume_modal).not_to_be_visible()
    volume_btn.click()
    expect(volume_modal).to_be_visible()
    page.click("body") # Click outside to close

    # 7. Take a screenshot for visual confirmation
    page.screenshot(path="redesigned_AOT_Music_Webpage.png")
