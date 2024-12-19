import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCommonData } from '@robby-rabbitman/cv-libs-common-data';
import { provideCommonStoreStub } from '@robby-rabbitman/cv-libs-common-data/testing';
import { assertA11y } from '@robby-rabbitman/cv-libs-web-util';
import { Shell } from './shell';

describe('[Unit Test] Shell', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideAnimationsAsync('noop'),
        provideCommonData(),
        provideCommonStoreStub(),
      ],
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
      providers: [
        provideAnimationsAsync('animations'),
        provideCommonData(),
        provideCommonStoreStub(),
      ],
    });
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(Shell);
    const component = fixture.componentInstance;

    expect(component).toBeInstanceOf(Shell);
  });

  it('should have no accessibility violations', async () => {
    const fixture = TestBed.createComponent(Shell);

    await expectAsync(assertA11y(fixture.nativeElement)).not.toBeRejected();
  });
});
