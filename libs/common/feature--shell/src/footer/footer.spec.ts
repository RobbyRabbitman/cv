import { TestBed } from '@angular/core/testing';
import { assertA11y } from '@robby-rabbitman/cv-libs-web-util';
import { Footer } from './footer';

describe('[Unit Test] Footer', () => {
  it('should create', async () => {
    const fixture = TestBed.createComponent(Footer);
    const component = fixture.componentInstance;

    expect(component).toBeInstanceOf(Footer);
  });
});

describe('[Component Test] Footer', () => {
  it('should create', async () => {
    const fixture = TestBed.createComponent(Footer);
    const component = fixture.componentInstance;

    expect(component).toBeInstanceOf(Footer);
  });

  it('should have no accessibility violations', async () => {
    const fixture = TestBed.createComponent(Footer);

    await expectAsync(assertA11y(fixture.nativeElement)).not.toBeRejected();
  });
});
