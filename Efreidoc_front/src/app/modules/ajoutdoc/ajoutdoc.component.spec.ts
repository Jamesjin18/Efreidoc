import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutdocComponent } from './ajoutdoc.component';

describe('AjoutdocComponent', () => {
  let component: AjoutdocComponent;
  let fixture: ComponentFixture<AjoutdocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutdocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutdocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
