import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDeleteComponent } from './risk-delete.component';

describe('RiskDeleteComponent', () => {
  let component: RiskDeleteComponent;
  let fixture: ComponentFixture<RiskDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
