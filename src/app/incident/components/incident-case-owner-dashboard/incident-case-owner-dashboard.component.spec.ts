import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCaseOwnerDashboardComponent } from './incident-case-owner-dashboard.component';

describe('IncidentCaseOwnerDashboardComponent', () => {
  let component: IncidentCaseOwnerDashboardComponent;
  let fixture: ComponentFixture<IncidentCaseOwnerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentCaseOwnerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentCaseOwnerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
