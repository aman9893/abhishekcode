import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeRequestDetailsComponent } from './back-office-request-details.component';

describe('BackOfficeRequestDetailsComponent', () => {
  let component: BackOfficeRequestDetailsComponent;
  let fixture: ComponentFixture<BackOfficeRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackOfficeRequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackOfficeRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
