import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcespageComponent } from './resourcespage.component';

describe('ResourcespageComponent', () => {
  let component: ResourcespageComponent;
  let fixture: ComponentFixture<ResourcespageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcespageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcespageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
