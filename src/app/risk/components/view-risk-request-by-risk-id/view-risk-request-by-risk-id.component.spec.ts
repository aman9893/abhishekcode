import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRiskRequestByRiskIdComponent } from './view-risk-request-by-risk-id.component';

describe('ViewRiskRequestByRiskIdComponent', () => {
  let component: ViewRiskRequestByRiskIdComponent;
  let fixture: ComponentFixture<ViewRiskRequestByRiskIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRiskRequestByRiskIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRiskRequestByRiskIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
