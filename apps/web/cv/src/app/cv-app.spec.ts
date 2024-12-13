import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { expect } from 'chai';
import { CvApp } from './cv-app';

describe('[Unit Test] CvApp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CvApp],
      providers: [provideExperimentalZonelessChangeDetection()],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CvApp);
    const app = fixture.componentInstance;
    expect(1).to.equal(2);
    expect(app).to.be.instanceOf(CvApp);
  });
});
