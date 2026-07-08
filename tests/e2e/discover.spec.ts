import { test, expect } from '@playwright/test';

test.describe('Discover Page', () => {
  test('loads discover page and searches for resources', async ({ page }) => {
    // We assume the ReadRadar is running on localhost:4321, testing the Discover page which is mostly client-side react
    await page.goto('/ReadRadar/discover');
    
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/ReadRadar/);
    
    // The search input should be visible
    const searchInput = page.getByPlaceholder('Search resources, tags, authors...');
    await expect(searchInput).toBeVisible();
    
    // Type into search input
    await searchInput.fill('Machine Learning');
    
    // Select domain filter
    const domainSelect = page.locator('select');
    await domainSelect.selectOption({ label: 'All Domains' });
    
    // We can't guarantee what is on the page since it's dynamic based on JSON, 
    // but we can check if the table rendered.
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });
});
