import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecmatComponent } from './selecmat.component';

describe('SelecmatComponent', () => {
  let component: SelecmatComponent;
  let fixture: ComponentFixture<SelecmatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelecmatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecmatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
