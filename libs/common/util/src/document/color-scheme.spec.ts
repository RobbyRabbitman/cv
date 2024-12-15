import {
  ApplicationRef,
  Injector,
  provideExperimentalZonelessChangeDetection,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type ColorScheme } from '@robby-rabbitman/cv-libs-common-types';
import { getPreferredColorScheme, setColorScheme } from './color-scheme';
import { WINDOW } from './inject-window';

describe('[Unit Test] setColorScheme', () => {
  it('should set the color scheme on the target element', async () => {
    const colorScheme = signal<ColorScheme>('dark');
    const someElement = document.createElement('div');

    expect(someElement.style.getPropertyValue('color-scheme')).not.toBe('dark');

    TestBed.runInInjectionContext(() =>
      setColorScheme({ colorScheme, targetElement: someElement }),
    );

    await TestBed.inject(ApplicationRef).whenStable();

    expect(someElement.style.getPropertyValue('color-scheme')).toBe('dark');
  });

  it('should not set a color scheme on the target element when the provided color scheme is system', async () => {
    const colorScheme = signal<ColorScheme>('dark');
    const someElement = document.createElement('div');

    expect(someElement.style.getPropertyValue('color-scheme')).not.toBe('dark');

    TestBed.runInInjectionContext(() =>
      setColorScheme({ colorScheme, targetElement: someElement }),
    );

    await TestBed.inject(ApplicationRef).whenStable();
    expect(someElement.style.getPropertyValue('color-scheme')).toBe('dark');

    colorScheme.set('system');
    await TestBed.inject(ApplicationRef).whenStable();
    expect(someElement.style.getPropertyValue('color-scheme')).toBe('');
  });

  it('should remove the color scheme property on cleanup', async () => {
    const colorScheme = signal<ColorScheme>('dark');
    const someElement = document.createElement('div');

    expect(someElement.style.getPropertyValue('color-scheme')).not.toBe('dark');

    const colorSchemeEffectRef = TestBed.runInInjectionContext(() =>
      setColorScheme({ colorScheme, targetElement: someElement }),
    );

    await TestBed.inject(ApplicationRef).whenStable();

    expect(someElement.style.getPropertyValue('color-scheme')).toBe('dark');

    colorSchemeEffectRef.destroy();

    expect(someElement.style.getPropertyValue('color-scheme')).toBe('');
  });

  it('should use the root element if no target element is provided', async () => {
    const colorScheme = signal<ColorScheme>('dark');

    expect(
      document.documentElement.style.getPropertyValue('color-scheme'),
    ).not.toBe('dark');

    TestBed.runInInjectionContext(() => setColorScheme({ colorScheme }));

    await TestBed.inject(ApplicationRef).whenStable();

    expect(
      document.documentElement.style.getPropertyValue('color-scheme'),
    ).toBe('dark');
  });
});

describe('[Unit Test] getPreferredColorScheme', () => {
  class MediaQueryListStub implements Partial<MediaQueryList> {
    readonly listeners: {
      type: string;
      listener: EventListener;
    }[] = [];

    constructor(public matches: boolean) {}

    addEventListener(type: string, listener: EventListener) {
      this.listeners.push({ type, listener });
    }

    removeEventListener(type: string, listener: EventListener) {
      const index = this.listeners.findIndex(
        (entry) => entry.type === type && entry.listener === listener,
      );

      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    }
  }

  let mediaQueryListStub: MediaQueryListStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {
          provide: WINDOW,
          useValue: {
            matchMedia: (query: string) => {
              mediaQueryListStub ??= new MediaQueryListStub(false);

              mediaQueryListStub.matches = query.includes('dark');

              return mediaQueryListStub;
            },
          },
        },
      ],
    });
  });

  it('should return the preferred color scheme', async () => {
    const preferredColorScheme = TestBed.runInInjectionContext(() =>
      getPreferredColorScheme(),
    );

    expect(preferredColorScheme()).toBe('dark');
  });

  it('should listen for changes in the color scheme preference', async () => {
    const preferredColorScheme = TestBed.runInInjectionContext(() =>
      getPreferredColorScheme(),
    );

    expect(preferredColorScheme()).toBe('dark');

    const light = mediaQueryListStub.listeners.at(0)!;
    const dark = mediaQueryListStub.listeners.at(1)!;

    light.listener({ matches: true } as MediaQueryListEvent);
    expect(preferredColorScheme()).toBe('light');

    dark.listener({ matches: true } as MediaQueryListEvent);
    expect(preferredColorScheme()).toBe('dark');
  });

  it('should return system as a preference when matchMedia api is not supported', async () => {
    TestBed.overrideProvider(WINDOW, { useValue: {} });

    const preferredColorScheme = TestBed.runInInjectionContext(() =>
      getPreferredColorScheme(),
    );

    expect(preferredColorScheme()).toBe('system');
  });

  it('removes the listener when the effect is destroyed', async () => {
    const preferredColorScheme = TestBed.runInInjectionContext(() =>
      getPreferredColorScheme(),
    );

    Injector.create({ providers: [], parent: TestBed.inject(Injector) });

    expect(preferredColorScheme()).toBe('dark');

    const light = mediaQueryListStub.listeners.at(0)!;
    const dark = mediaQueryListStub.listeners.at(1)!;

    light.listener({ matches: true } as MediaQueryListEvent);
    expect(preferredColorScheme()).toBe('light');

    dark.listener({ matches: true } as MediaQueryListEvent);
    expect(preferredColorScheme()).toBe('dark');

    /** Cause destruction */
    TestBed.resetTestingModule();

    expect(mediaQueryListStub.listeners.length).toEqual(0);
  });
});
