import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParagraphEditor } from './paragraph';

describe('Paragraph', () => {
  let component: ParagraphEditor;
  let fixture: ComponentFixture<ParagraphEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParagraphEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(ParagraphEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
