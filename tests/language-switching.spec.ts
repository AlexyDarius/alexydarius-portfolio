import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test('should switch from English to French when using language toggle', async ({ page }) => {
    // Start with English
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Verify we're in English initially
    await expect(page.locator('text=Systems & Software Engineer')).toBeVisible();
    
    // Click on language toggle
    await page.locator('button:has-text("EN")').click();
    
    // Click on French option
    await page.locator('button:has-text("Français")').click();
    
    // Wait for page reload and verify French content
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Ingénieur Systèmes & Logiciels')).toBeVisible();
    
    // Verify language toggle shows FR
    await expect(page.locator('button:has-text("FR")')).toBeVisible();
  });

  test('should switch from French to English when using language toggle', async ({ page }) => {
    // Set French cookie first
    await page.context().addCookies([{
      name: 'language',
      value: 'FR',
      domain: 'localhost',
      path: '/'
    }]);
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Verify we're in French initially
    await expect(page.locator('text=Ingénieur Systèmes & Logiciels')).toBeVisible();
    
    // Click on language toggle
    await page.locator('button:has-text("FR")').click();
    
    // Click on English option
    await page.locator('button:has-text("English")').click();
    
    // Wait for page reload and verify English content
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Systems & Software Engineer')).toBeVisible();
    
    // Verify language toggle shows EN
    await expect(page.locator('button:has-text("EN")')).toBeVisible();
  });

  test('should persist language choice across page navigation', async ({ page }) => {
    // Set French language
    await page.context().addCookies([{
      name: 'language',
      value: 'FR',
      domain: 'localhost',
      path: '/'
    }]);
    
    // Start on home page
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('text=Ingénieur Systèmes & Logiciels')).toBeVisible();
    
    // Navigate to work page
    await page.goto('/work', { waitUntil: 'networkidle' });
    
    // Should still be in French
    await expect(page.locator('[data-testid="projects-section"]')).toBeVisible();
    
    // Check for French project titles
    await expect(page.locator('h2:has-text("Construire Once UI")')).toBeVisible();
  });
}); 