import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteCvButton } from './delete-cv-button';

describe('DeleteCvButton', () => {
  let component: DeleteCvButton;
  let fixture: ComponentFixture<DeleteCvButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCvButton],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCvButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
