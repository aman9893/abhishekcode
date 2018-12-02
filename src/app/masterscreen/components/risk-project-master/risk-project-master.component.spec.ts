import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskProjectMasterComponent } from './risk-project-master.component';

describe('RiskProjectMasterComponent', () => {
  let component: RiskProjectMasterComponent;
  let fixture: ComponentFixture<RiskProjectMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskProjectMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskProjectMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
