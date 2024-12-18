import { TestBed } from '@angular/core/testing';
import { CommonStore } from '../store/common.store';
import { withCommonStore } from './with-common-store';

describe('[Unit Test] withCommonStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [withCommonStore()],
    });
  });

  it('should provide CommonStore', () => {
    const commonStore = TestBed.inject(CommonStore);
    expect(commonStore).toBeInstanceOf(CommonStore);
  });
});
