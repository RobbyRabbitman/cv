import { TestBed } from '@angular/core/testing';
import { CvApp } from './cv-app';
import { CV_APP_CONFIG } from './cv-app.config';

describe('[Integration Test] CvApp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CV_APP_CONFIG.providers],
    });
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(CvApp);
    const app = fixture.componentInstance;

    await fixture.whenStable();
    expect(app).toBeInstanceOf(CvApp);
  });
});
