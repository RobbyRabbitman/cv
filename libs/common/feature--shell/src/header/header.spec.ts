import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { assertA11y } from '@robby-rabbitman/cv-libs-web-util';
import { Header } from './header';

describe('[Unit Test] Header', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [Header],
    });
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(Header);
    const component = fixture.componentInstance;

    expect(component).toBeInstanceOf(Header);
  });

  it('should have no accessibility violations', async () => {
    const fixture = TestBed.createComponent(Header);

    expect(() => assertA11y(fixture.nativeElement)).not.toThrow();
  });
});