import { test, expect } from '@playwright/test';

test.describe('Language-specific Projects', () => {
  test('should display English projects with English browser locale', async ({ page }) => {
    // Set English locale
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check that projects are visible
    await expect(page.locator('[data-testid="projects-section"]')).toBeVisible();
    
    // Check for English project titles (be more specific)
    await expect(page.locator('h2:has-text("Once UI: Open-source design system")')).toBeVisible();
    
    // Verify page language indicators
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Systems & Software Engineer');
  });

  test('should display French projects with French browser locale', async ({ browser }) => {
    // Create context with French locale
    const context = await browser.newContext({
      locale: 'fr-FR',
      extraHTTPHeaders: {
        'Accept-Language': 'fr-FR,fr;q=0.9'
      }
    });
    
    const page = await context.newPage();
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check that projects are visible
    await expect(page.locator('[data-testid="projects-section"]')).toBeVisible();
    
    // Check for French project titles
    await expect(page.locator('h2:has-text("Once UI : Système de design open-source")')).toBeVisible();
    
    // Verify page language indicators for French
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Ingénieur Systèmes & Logiciels');
    
    await context.close();
  });

  test('should display projects on work page in English', async ({ page }) => {
    await page.goto('/work', { waitUntil: 'networkidle' });
    
    // Check that projects are visible
    await expect(page.locator('[data-testid="projects-section"]')).toBeVisible();
    
    // Check for project cards
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount(2);
  });

  test('should display projects on work page in French', async ({ browser }) => {
    const context = await browser.newContext({
      locale: 'fr-FR',
      extraHTTPHeaders: {
        'Accept-Language': 'fr-FR,fr;q=0.9'
      }
    });
    
    const page = await context.newPage();
    await page.goto('/work', { waitUntil: 'networkidle' });
    
    // Check that projects are visible
    await expect(page.locator('[data-testid="projects-section"]')).toBeVisible();
    
    // Check for project cards
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount(2);
    
    await context.close();
  });

  test('should navigate to individual project pages', async ({ page }) => {
    await page.goto('/work', { waitUntil: 'networkidle' });
    
    // Wait for project cards to be visible
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount(2);
    
    // Click on the "Read case study" link (which has relative URLs like "work/project-name")
    const readCaseStudyLink = page.locator('text=Read case study').first();
    await expect(readCaseStudyLink).toBeVisible();
    await readCaseStudyLink.click();
    
    // Should navigate to project detail page
    await expect(page).toHaveURL(/\/work\/.+/);
    
    // Should display project content
    await expect(page.locator('h1')).toBeVisible();
  });
}); 