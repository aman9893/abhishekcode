import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationRequestsTrendComponent } from './observation-requests-trend.component';

describe('ObservationRequestsTrendComponent', () => {
  let component: ObservationRequestsTrendComponent;
  let fixture: ComponentFixture<ObservationRequestsTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationRequestsTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationRequestsTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
