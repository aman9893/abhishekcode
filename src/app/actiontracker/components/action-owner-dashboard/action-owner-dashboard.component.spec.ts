import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionOwnerDashboardComponent } from './action-owner-dashboard.component';

describe('ActionOwnerDashboardComponent', () => {
  let component: ActionOwnerDashboardComponent;
  let fixture: ComponentFixture<ActionOwnerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionOwnerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionOwnerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
