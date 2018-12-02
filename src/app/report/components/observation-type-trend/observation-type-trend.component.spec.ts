import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationTypeTrendComponent } from './observation-type-trend.component';

describe('ObservationTypeTrendComponent', () => {
  let component: ObservationTypeTrendComponent;
  let fixture: ComponentFixture<ObservationTypeTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationTypeTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationTypeTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
