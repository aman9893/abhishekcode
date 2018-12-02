import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderEscalationComponent } from './reminder-escalation.component';

describe('ReminderEscalationComponent', () => {
  let component: ReminderEscalationComponent;
  let fixture: ComponentFixture<ReminderEscalationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderEscalationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderEscalationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
