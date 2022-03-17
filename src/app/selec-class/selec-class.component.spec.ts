import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecClassComponent } from './selec-class.component';

describe('SelecClassComponent', () => {
  let component: SelecClassComponent;
  let fixture: ComponentFixture<SelecClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelecClassComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
