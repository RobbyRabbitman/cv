import { TestBed } from '@angular/core/testing';
import { CvApp } from './cv-app';

describe('[Unit Test] CvApp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CvApp],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CvApp);
    const app = fixture.componentInstance;
    expect(app).toBeInstanceOf(CvApp);
  });
});
