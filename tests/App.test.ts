import { test, expect } from '@playwright/test';

test('Search for location and verify result', async ({ page }) => {
  // Navigate to your app's URL
  await page.goto('http://localhost:5173/');

  // Enter "Campo Grande" in the search bar
  await page.fill('.search-bar input[type="text"]', 'Campo Grande');

  // Click the search button to start searching
  await page.click('.search-bar button');

  // Wait for weather card to have a "show" class.
  await page.waitForFunction(() => {
    const element = document.querySelector('.weather-card');
    if (!element) return false;
    return element.classList.contains('show');
  });

  // Wait for the location element to appear
  await page.waitForSelector('.location');

  // Get the text content of the location element
  const locationText = await page.textContent('.location');

  // Assert that the location text is "Campo Grande, BR"
  expect(locationText).toBe('Campo Grande, BR');
});