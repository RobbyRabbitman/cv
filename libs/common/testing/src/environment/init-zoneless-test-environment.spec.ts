import { TestBed } from '@angular/core/testing';
import { initZonelessTestEnvironment } from './init-zoneless-test-environment';

describe('[Unit Test] initZonelessTestEnvironment', () => {
  it('should reset any previous test environment', async () => {
    spyOn(TestBed, 'resetTestEnvironment').and.callThrough();

    initZonelessTestEnvironment();

    expect(TestBed.resetTestEnvironment).toHaveBeenCalled();
  });
});
