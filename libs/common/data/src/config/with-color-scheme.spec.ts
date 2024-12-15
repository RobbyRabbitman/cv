import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  provideExperimentalZonelessChangeDetection,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ColorScheme } from '@robby-rabbitman/cv-libs-common-types';
import { CommonStore } from '../store/common.store';
import { provideCommonData } from './common.config';
import { withColorScheme } from './with-color-scheme';

describe('[Unit Test] withColorScheme', () => {
  class CommonStoreStub implements Partial<InstanceType<typeof CommonStore>> {
    colorScheme = signal<ColorScheme>('dark');
  }

  let someElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        CommonStoreStub,
        {
          provide: CommonStore,
          useExisting: CommonStoreStub,
        },
        withColorScheme({
          targetElement: (someElement = document.createElement('div')),
        }),
      ],
    });
  });

  it('should set the color scheme based on the common store', async () => {
    const commenStore = TestBed.inject(CommonStoreStub);
    const app = TestBed.inject(ApplicationRef);

    await app.whenStable();
    expect(someElement.style.getPropertyValue('color-scheme')).toBe('dark');

    commenStore.colorScheme.set('light');
    await app.whenStable();
    expect(someElement.style.getPropertyValue('color-scheme')).toBe('light');
  });
});

describe('[Integration Test] withColorScheme', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideCommonData(),
      ],
    });
  });

  it('should set the color scheme on the root element based on the common store', async () => {
    const commenStore = TestBed.inject(CommonStore);
    const app = TestBed.inject(ApplicationRef);
    const document = TestBed.inject(DOCUMENT);

    await app.whenStable();
    expect(
      document.documentElement.style.getPropertyValue('color-scheme'),
    ).toBe('');

    commenStore.setColorScheme('light');
    await app.whenStable();
    expect(
      document.documentElement.style.getPropertyValue('color-scheme'),
    ).toBe('light');

    commenStore.setColorScheme('dark');
    await app.whenStable();
    expect(
      document.documentElement.style.getPropertyValue('color-scheme'),
    ).toBe('dark');
  });
});
