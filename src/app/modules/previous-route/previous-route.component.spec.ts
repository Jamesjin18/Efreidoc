import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousRouteComponent } from './previous-route.component';

describe('PreviousRouteComponent', () => {
  let component: PreviousRouteComponent;
  let fixture: ComponentFixture<PreviousRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviousRouteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
