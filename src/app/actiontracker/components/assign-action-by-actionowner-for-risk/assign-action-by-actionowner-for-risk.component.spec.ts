import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignActionByActionownerForRiskComponent } from './assign-action-by-actionowner-for-risk.component';

describe('AssignActionByActionownerForRiskComponent', () => {
  let component: AssignActionByActionownerForRiskComponent;
  let fixture: ComponentFixture<AssignActionByActionownerForRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignActionByActionownerForRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignActionByActionownerForRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
