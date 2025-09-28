import { expect, test } from '../test.js';

test('delete a cv', async ({ auth, cvDocumentsPage }) => {
  await auth.signIn();

  await cvDocumentsPage.goTo();
  await expect(cvDocumentsPage.getEditCvButton(/New CV/)).toHaveCount(0);

  await cvDocumentsPage.createCv();
  await expect(cvDocumentsPage.getEditCvButton(/New CV/)).toHaveCount(1);

  await cvDocumentsPage.deleteCv(/New CV/);
  await expect(cvDocumentsPage.getEditCvButton(/New CV/)).toHaveCount(0);
});
