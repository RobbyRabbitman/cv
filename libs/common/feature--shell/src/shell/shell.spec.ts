import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { assertA11y } from '@robby-rabbitman/cv-libs-web-util';
import { Shell } from './shell';

describe('[Unit Test] Shell', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideAnimationsAsync('noop')],
      imports: [Shell],
    });
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(Shell);
    const component = fixture.componentInstance;

    expect(component).toBeInstanceOf(Shell);
  });
});

describe('[Component Test] Shell', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideAnimationsAsync('animations')],
      imports: [Shell],
    });
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(Shell);
    const component = fixture.componentInstance;

    expect(component).toBeInstanceOf(Shell);
  });

  it('should have no accessibility violations', async () => {
    const fixture = TestBed.createComponent(Shell);

    expect(() => assertA11y(fixture.nativeElement)).not.toThrow();
  });
});
