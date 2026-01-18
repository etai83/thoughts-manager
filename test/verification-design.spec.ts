import { test, expect } from '@playwright/test';

test('verify new design implementation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('/');

  const header = page.locator('header');
  await expect(header).toBeVisible();
  await expect(header).toContainText('ThoughtsManager');
  await expect(header.locator('.material-symbols-outlined', { hasText: 'hub' }).first()).toBeVisible();

  const sidebar = page.locator('aside').first();
  await expect(sidebar).toBeVisible();
  await expect(sidebar).toContainText('Semantic Discovery');
  await expect(sidebar.locator('text=Auto-Connect')).toBeVisible();

  const contextPanel = page.locator('aside').nth(1);
  await expect(contextPanel).toBeVisible();
  await expect(contextPanel).toContainText('Graph Context');
  await expect(contextPanel).toContainText('Relevant Notes');

  const canvas = page.locator('.react-flow');
  await expect(canvas).toBeVisible();
  
  const floatingControls = page.locator('button[title="Add Node"]');
  await expect(floatingControls).toBeVisible();

  await floatingControls.click();
  
  const node = page.locator('.react-flow__node-thought').first();
  await expect(node).toBeVisible();
  
  const nodeContent = node.locator('.glass-panel');
  await expect(nodeContent).toBeVisible();
  
  await expect(node.locator('.material-symbols-outlined', { hasText: 'more_horiz' })).toBeVisible();
});
