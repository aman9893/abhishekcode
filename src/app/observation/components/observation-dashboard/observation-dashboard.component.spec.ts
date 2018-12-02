import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationDashboardComponent } from './observation-dashboard.component';

describe('ObservationDashboardComponent', () => {
  let component: ObservationDashboardComponent;
  let fixture: ComponentFixture<ObservationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
