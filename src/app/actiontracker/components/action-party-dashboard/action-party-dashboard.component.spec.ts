import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPartyDashboardComponent } from './action-party-dashboard.component';

describe('ActionPartyDashboardComponent', () => {
  let component: ActionPartyDashboardComponent;
  let fixture: ComponentFixture<ActionPartyDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPartyDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPartyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
