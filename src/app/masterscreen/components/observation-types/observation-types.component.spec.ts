import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationTypesComponent } from './observation-types.component';

describe('ObservationTypesComponent', () => {
  let component: ObservationTypesComponent;
  let fixture: ComponentFixture<ObservationTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
