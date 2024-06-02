import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CvActionMenu } from './cv-action-menu';

describe('CvActionMenu', () => {
  let component: CvActionMenu;
  let fixture: ComponentFixture<CvActionMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvActionMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(CvActionMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
