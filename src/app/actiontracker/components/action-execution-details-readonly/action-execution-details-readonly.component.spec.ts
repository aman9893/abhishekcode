import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionExecutionDetailsReadonlyComponent } from './action-execution-details-readonly.component';

describe('ActionExecutionDetailsReadonlyComponent', () => {
  let component: ActionExecutionDetailsReadonlyComponent;
  let fixture: ComponentFixture<ActionExecutionDetailsReadonlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionExecutionDetailsReadonlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionExecutionDetailsReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
