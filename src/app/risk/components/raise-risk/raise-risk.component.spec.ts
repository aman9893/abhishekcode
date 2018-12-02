import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseRiskComponent } from './raise-risk.component';

describe('RaiseRiskComponent', () => {
  let component: RaiseRiskComponent;
  let fixture: ComponentFixture<RaiseRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaiseRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
