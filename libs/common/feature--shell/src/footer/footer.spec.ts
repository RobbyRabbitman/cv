import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import axe from 'axe-core';
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

    const a11y = await axe.run(fixture.nativeElement);

    expect(a11y.violations.length).toBe(0);
  });
});
