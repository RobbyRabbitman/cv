import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAuthData } from '@robby-rabbitman/cv-libs-auth-data';
import { provideAuthDataTesting } from '@robby-rabbitman/cv-libs-auth-data/testing';
import { provideI18nData } from '@robby-rabbitman/cv-libs-i18n-data';
import { provideI18nDataTesting } from '@robby-rabbitman/cv-libs-i18n-data/testing';
import { provideTranslation } from '@robby-rabbitman/cv-libs-i18n-features-translation';
import { CvApp } from './cv-app';
import { CV_APP_ROUTES } from './cv-routes';

describe('[Integration Test] CvApp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(CV_APP_ROUTES),

        /** Auth */
        provideAuthData(),
        provideAuthDataTesting(),

        /** I18n */
        provideI18nData(),
        provideI18nDataTesting(),
        provideTranslation(),
      ],
    });
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(CvApp);
    const app = fixture.componentInstance;

    await fixture.whenStable();
    expect(app).toBeInstanceOf(CvApp);
  });
});
