import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { assertA11y } from '@robby-rabbitman/cv-libs-web-util';
import { CvApp } from './cv-app';
import { cvAppConfig } from './cv-app.config';

describe('[Unit Test] CvApp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideAnimationsAsync('noop')],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CvApp);
    const app = fixture.componentInstance;
    expect(app).toBeInstanceOf(CvApp);
  });
});

describe('[Integration Test] CvApp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [cvAppConfig.providers],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CvApp);
    const app = fixture.componentInstance;
    expect(app).toBeInstanceOf(CvApp);
  });

  it('should have no accessibility violations', async () => {
    const fixture = TestBed.createComponent(CvApp);

    expect(() => assertA11y(fixture.nativeElement)).not.toThrow();
  });
});
