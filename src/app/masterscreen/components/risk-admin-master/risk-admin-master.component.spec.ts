import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAdminMasterComponent } from './risk-admin-master.component';

describe('RiskAdminMasterComponent', () => {
  let component: RiskAdminMasterComponent;
  let fixture: ComponentFixture<RiskAdminMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAdminMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAdminMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
