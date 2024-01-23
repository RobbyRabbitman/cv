import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSelect } from './theme-select';

describe('ThemeSelect', () => {
  let component: ThemeSelect;
  let fixture: ComponentFixture<ThemeSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
