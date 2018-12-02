import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelObservationComponent } from './cancel-observation.component';

describe('CancelObservationComponent', () => {
  let component: CancelObservationComponent;
  let fixture: ComponentFixture<CancelObservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelObservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
