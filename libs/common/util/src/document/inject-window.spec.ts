import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { injectWindow } from './inject-window';

describe('[Unit Test] injectWindow', () => {
  const mockWindow = Symbol('window') as unknown as Window;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: {
            defaultView: mockWindow,
          },
        },
      ],
    });
  });

  it('should get the window of the document', () => {
    expect(TestBed.runInInjectionContext(() => injectWindow())).toBe(
      mockWindow,
    );
  });

  it('should throw an error if there is no window in the document', () => {
    TestBed.overrideProvider(DOCUMENT, {
      useValue: {},
    });

    expect(() =>
      TestBed.runInInjectionContext(() => injectWindow()),
    ).toThrowError('There is no window in this document.');
  });
});

describe('[Integration Test] injectWindow', () => {
  it('should get the window of the document', () => {
    expect(TestBed.runInInjectionContext(() => injectWindow())).toBe(window);
  });
});
