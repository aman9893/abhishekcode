import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionOwnerActionComponent } from './action-owner-action.component';

describe('ActionOwnerActionComponent', () => {
  let component: ActionOwnerActionComponent;
  let fixture: ComponentFixture<ActionOwnerActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionOwnerActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionOwnerActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
