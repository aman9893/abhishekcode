import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HSEAdvisorActionComponent } from './hseadvisor-action.component';

describe('AdvisorAction.ComponentComponent', () => {
  let component: HSEAdvisorActionComponent;
  let fixture: ComponentFixture<HSEAdvisorActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HSEAdvisorActionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HSEAdvisorActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
