import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTrackerDasboardComponent } from './action-tracker-dashboard.component';

describe('ActionTrackerDasboardComponent', () => {
  let component: ActionTrackerDasboardComponent;
  let fixture: ComponentFixture<ActionTrackerDasboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionTrackerDasboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionTrackerDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
