import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { provideCommonData } from '@robby-rabbitman/cv-libs-common-data';
import { provideCommonStoreStub } from '@robby-rabbitman/cv-libs-common-data/testing';
import { SelectColorSchemeHarness } from '@robby-rabbitman/cv-libs-common-feature--color-scheme/testing';
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

  it('should have a color scheme select', async () => {
    const fixture = TestBed.createComponent(Header);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const selectColorScheme = await loader.getHarness(SelectColorSchemeHarness);

    expect(selectColorScheme).toBeTruthy();
  });
});
