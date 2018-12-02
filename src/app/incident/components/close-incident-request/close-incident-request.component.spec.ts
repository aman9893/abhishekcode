import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseIncidentRequestComponent } from './close-incident-request.component';

describe('CloseIncidentRequestComponent', () => {
  let component: CloseIncidentRequestComponent;
  let fixture: ComponentFixture<CloseIncidentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseIncidentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseIncidentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
