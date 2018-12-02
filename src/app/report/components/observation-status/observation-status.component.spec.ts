import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationStatusComponent } from './observation-status.component';

describe('ObservationStatusComponent', () => {
  let component: ObservationStatusComponent;
  let fixture: ComponentFixture<ObservationStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
