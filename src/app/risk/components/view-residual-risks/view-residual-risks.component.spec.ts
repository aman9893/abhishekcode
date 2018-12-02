import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResidualRisksComponent } from './view-residual-risks.component';

describe('ViewResidualRisksComponent', () => {
  let component: ViewResidualRisksComponent;
  let fixture: ComponentFixture<ViewResidualRisksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewResidualRisksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewResidualRisksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
