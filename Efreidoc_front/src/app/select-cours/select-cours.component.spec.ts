import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCoursComponent } from './select-cours.component';

describe('SelectCoursComponent', () => {
  let component: SelectCoursComponent;
  let fixture: ComponentFixture<SelectCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
