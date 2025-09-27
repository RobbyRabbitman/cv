import { expect, test } from '../test.js';

test('has logo', async ({ shell }) => {
  const logo = shell.header.getByRole('link', { name: 'EasyCv' });

  await expect(logo).toBeVisible();
});
