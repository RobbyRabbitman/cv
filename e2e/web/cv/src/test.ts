import { test as base } from '@playwright/test';
import { Auth } from './fixtures/auth.js';
import { CvDocumentsPage } from './fixtures/cv-documents-page.js';
import { LocaleMenu } from './fixtures/locale-menu.js';

export const test = base.extend<{
  localeMenu: LocaleMenu;
  auth: Auth;
  cvDocumentsPage: CvDocumentsPage;
  defaultUser: string | RegExp;
}>({
  defaultUser: /Mountain Olive/,

  page: async ({ baseURL, page }, use) => {
    if (baseURL) {
      await page.goto(baseURL);
    }

    await use(page);
  },

  localeMenu: async ({ page }, use) => {
    const localeMenu = new LocaleMenu(page);

    await use(localeMenu);

    /** Reset locale to English after each test. */
    await localeMenu.switchLocale('English');
  },

  auth: async ({ page }, use) => {
    const auth = new Auth(page);

    await use(auth);

    if (await auth.isSignedIn()) {
      await auth.signOut();
    }
  },

  cvDocumentsPage: async ({ page }, use) => {
    const cvDocumentsPage = new CvDocumentsPage(page);

    await use(cvDocumentsPage);

    /** TODO: delete all created CVs after each test */
  },
});

export { expect } from '@playwright/test';
