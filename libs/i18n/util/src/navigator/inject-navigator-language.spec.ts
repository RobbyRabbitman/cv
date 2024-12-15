import { TestBed } from '@angular/core/testing';
import {
  injectWindow,
  provideWindow,
  WINDOW,
} from '@robby-rabbitman/cv-libs-common-util';
import { injectNavigatorLanguage } from './inject-navigator-language';

describe('[Unit Test] injectNavigatorLanguage', () => {
  const mockNavigatorLanguage = 'en-US';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideWindow(() => {
          return {
            navigator: { language: mockNavigatorLanguage },
          } as unknown as NonNullable<ReturnType<typeof injectWindow>>;
        }),
      ],
    });
  });

  it('should return the navigator language', () => {
    expect(TestBed.runInInjectionContext(() => injectNavigatorLanguage())).toBe(
      mockNavigatorLanguage,
    );
  });

  it('should assert a BCP 47 tag be default', () => {
    TestBed.overrideProvider(WINDOW, {
      useValue: {
        navigator: { language: 'invalid-bcp47-tag' },
      },
    });

    expect(() =>
      TestBed.runInInjectionContext(() => injectNavigatorLanguage()),
    ).toThrowError(
      "Navigator language 'invalid-bcp47-tag' is not a valid BCP 47 tag.",
    );
  });

  it('should not assert a BCP 47 tag when specified', () => {
    TestBed.overrideProvider(WINDOW, {
      useValue: {
        navigator: { language: 'invalid-bcp47-tag' },
      },
    });

    expect(
      TestBed.runInInjectionContext(() =>
        injectNavigatorLanguage({ assertBCP47tag: false }),
      ),
    ).toBe('invalid-bcp47-tag');
  });
});

describe('[Integration Test] injectNavigatorLanguage', () => {
  it('should return the navigator BCP 47 language tag', () => {
    expect(TestBed.runInInjectionContext(() => injectNavigatorLanguage())).toBe(
      navigator.language,
    );
  });
});
