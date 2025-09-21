import { expect, test } from '../test.js';

test('create a new cv', async ({ auth, cvDocumentsPage }) => {
  await auth.signIn();

  await cvDocumentsPage.goTo();

  await cvDocumentsPage.createCv();
  await expect(cvDocumentsPage.getCv(/New CV/)).toHaveCount(1);

  await cvDocumentsPage.createCv();
  await expect(cvDocumentsPage.getCv(/New CV/)).toHaveCount(2);
});
