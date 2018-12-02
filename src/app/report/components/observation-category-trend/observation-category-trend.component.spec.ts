import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationCategoryTrendComponent } from './observation-category-trend.component';

describe('ObservationCategoryTrendComponent', () => {
  let component: ObservationCategoryTrendComponent;
  let fixture: ComponentFixture<ObservationCategoryTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationCategoryTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationCategoryTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
