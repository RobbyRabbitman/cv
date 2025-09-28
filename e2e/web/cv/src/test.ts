import { test as base } from '@playwright/test';
import { Auth } from './fixtures/auth/auth.js';
import { GlobalMenu } from './fixtures/common/global-menu.js';
import { Shell } from './fixtures/common/shell.js';
import { CvDocumentsPage } from './fixtures/cv/cv-documents-page.js';
import { LocaleMenu } from './fixtures/i18n/locale-menu.js';

export const test = base.extend<{
  shell: Shell;
  localeMenu: LocaleMenu;
  globalMenu: GlobalMenu;
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

  shell: async ({ page }, use) => {
    const shell = new Shell(page);

    await use(shell);
  },

  localeMenu: async ({ shell }, use) => {
    const localeMenu = new LocaleMenu(shell);

    await use(localeMenu);

    /** Reset locale to English after each test. */
    await localeMenu.switchLocale('English');
  },

  globalMenu: async ({ shell }, use) => {
    const globalMenu = new GlobalMenu(shell);

    await use(globalMenu);
  },

  auth: async ({ shell }, use) => {
    const auth = new Auth(shell);

    await use(auth);

    if (await auth.isSignedIn()) {
      await auth.signOut();
    }
  },

  cvDocumentsPage: async ({ shell }, use) => {
    const cvDocumentsPage = new CvDocumentsPage(shell);

    await use(cvDocumentsPage);

    /** TODO: delete all created CVs after each test */
  },
});

export { expect } from '@playwright/test';
