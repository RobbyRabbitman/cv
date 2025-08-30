import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAuthData } from '@robby-rabbitman/cv-libs-auth-data';
import { provideAuthDataTesting } from '@robby-rabbitman/cv-libs-auth-data/testing';
import { CvApp } from './cv-app';
import { CV_APP_ROUTES } from './cv-routes';

describe('[Integration Test] CvApp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideAuthData(),
        provideRouter(CV_APP_ROUTES),
        provideAuthDataTesting(),
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
