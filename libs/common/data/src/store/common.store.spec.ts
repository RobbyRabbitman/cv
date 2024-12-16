import { TestBed } from '@angular/core/testing';
import { COLOR_SCHEMES } from '@robby-rabbitman/cv-libs-common-types';
import { CommonStore } from './common.store';

describe('[Unit Test] CommonStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonStore],
    });
  });

  it('should be created', () => {
    const store = TestBed.inject(CommonStore);
    expect(store).toBeInstanceOf(CommonStore);
  });

  describe('initial state', () => {
    it('should have the app name', () => {
      const store = TestBed.inject(CommonStore);
      expect(store.appName()).toBe('CV');
    });

    it('should use system for color scheme', () => {
      const store = TestBed.inject(CommonStore);
      expect(store.colorScheme()).toBe('system');
    });

    it('should define all possible color schemes', () => {
      const store = TestBed.inject(CommonStore);
      expect(store.colorSchemes()).toEqual(COLOR_SCHEMES);
    });
  });

  describe('setColorScheme', () => {
    it('should set the color scheme', () => {
      const store = TestBed.inject(CommonStore);

      store.setColorScheme('dark');
      expect(store.colorScheme()).toEqual('dark');

      store.setColorScheme('light');
      expect(store.colorScheme()).toEqual('light');

      store.setColorScheme('system');
      expect(store.colorScheme()).toEqual('system');
    });
  });
});
