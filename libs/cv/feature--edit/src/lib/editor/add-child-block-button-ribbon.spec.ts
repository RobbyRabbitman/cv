import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddChildBlockButtonRibbon } from './add-child-block-button-ribbon';

describe('AddChildBlockButtonRibbon', () => {
  let component: AddChildBlockButtonRibbon;
  let fixture: ComponentFixture<AddChildBlockButtonRibbon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddChildBlockButtonRibbon],
    }).compileComponents();

    fixture = TestBed.createComponent(AddChildBlockButtonRibbon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
