import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionEditor } from './section';

describe('Section', () => {
  let component: SectionEditor;
  let fixture: ComponentFixture<SectionEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
