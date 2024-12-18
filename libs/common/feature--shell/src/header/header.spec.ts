import { TestBed } from '@angular/core/testing';
import { provideCommonData } from '@robby-rabbitman/cv-libs-common-data';
import { provideCommonStoreStub } from '@robby-rabbitman/cv-libs-common-data/testing';
import { assertA11y } from '@robby-rabbitman/cv-libs-web-util';
import { Header } from './header';

describe('[Unit Test] Header', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideCommonData(), provideCommonStoreStub()],
    });
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(Header);
    const component = fixture.componentInstance;

    expect(component).toBeInstanceOf(Header);
  });
});

describe('[Component Test] Header', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideCommonData(), provideCommonStoreStub()],
    });
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(Header);
    const component = fixture.componentInstance;

    expect(component).toBeInstanceOf(Header);
  });

  it('should have no accessibility violations', async () => {
    const fixture = TestBed.createComponent(Header);

    await expectAsync(assertA11y(fixture.nativeElement)).not.toBeRejected();
  });
});
