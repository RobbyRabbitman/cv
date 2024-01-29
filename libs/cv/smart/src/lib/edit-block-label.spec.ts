import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditBlockLabel } from './edit-block-label';

describe('EditBlockLabel', () => {
  let component: EditBlockLabel;
  let fixture: ComponentFixture<EditBlockLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBlockLabel],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBlockLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
