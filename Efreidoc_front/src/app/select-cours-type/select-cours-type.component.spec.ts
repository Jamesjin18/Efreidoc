import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCoursTypeComponent } from './select-cours-type.component';

describe('SelectCoursTypeComponent', () => {
  let component: SelectCoursTypeComponent;
  let fixture: ComponentFixture<SelectCoursTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectCoursTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCoursTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
