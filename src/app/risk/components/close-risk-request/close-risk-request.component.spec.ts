import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseRiskRequestComponent } from './close-risk-request.component';

describe('CloseRiskRequestComponent', () => {
  let component: CloseRiskRequestComponent;
  let fixture: ComponentFixture<CloseRiskRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseRiskRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseRiskRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
