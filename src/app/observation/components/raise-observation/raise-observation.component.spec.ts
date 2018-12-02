import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseObservationComponent } from './raise-observation.component';

describe('RaiseObservationComponent', () => {
  let component: RaiseObservationComponent;
  let fixture: ComponentFixture<RaiseObservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaiseObservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
