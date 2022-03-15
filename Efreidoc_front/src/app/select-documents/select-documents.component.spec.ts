import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDocumentsComponent } from './select-documents.component';

describe('SelectDocumentsComponent', () => {
  let component: SelectDocumentsComponent;
  let fixture: ComponentFixture<SelectDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
