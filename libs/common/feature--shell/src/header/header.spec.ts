import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import axe from 'axe-core';
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

    const a11y = await axe.run(fixture.nativeElement);

    expect(a11y.violations.length).toBe(0);
  });
});
