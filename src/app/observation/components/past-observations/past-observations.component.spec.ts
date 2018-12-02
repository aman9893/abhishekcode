import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastObservationsComponent } from './past-observations.component';

describe('PastObservationsComponent', () => {
  let component: PastObservationsComponent;
  let fixture: ComponentFixture<PastObservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastObservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
