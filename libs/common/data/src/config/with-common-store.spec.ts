import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonStore } from '../store/common.store';
import { provideCommonStore } from './with-common-store';

describe('[Unit Test] provideCommonStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideCommonStore(),
      ],
    });
  });

  it('should inject CommonStore', () => {
    const commonStore = TestBed.inject(CommonStore);
    expect(commonStore).toBeInstanceOf(CommonStore);
  });
});
