import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { assertA11y } from '@robby-rabbitman/cv-libs-web-util';
import { Footer } from './footer';

describe('[Unit Test] Footer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [Footer],
    });
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(Footer);
    const component = fixture.componentInstance;

    expect(component).toBeInstanceOf(Footer);
  });

  it('should have no accessibility violations', async () => {
    const fixture = TestBed.createComponent(Footer);

    expect(() => assertA11y(fixture.nativeElement)).not.toThrow();
  });
});