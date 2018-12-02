import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationStatusReportComponent } from './observation-status-report.component';

describe('ObservationStatusReportComponent', () => {
  let component: ObservationStatusReportComponent;
  let fixture: ComponentFixture<ObservationStatusReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationStatusReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
