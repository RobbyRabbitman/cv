import { expect, test } from '../test.js';

test('has logo', async ({ page }) => {
  const logo = page.getByRole('link', { name: 'EasyCv' });

  await expect(logo).toBeVisible();
});
