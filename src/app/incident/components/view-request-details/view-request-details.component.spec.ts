import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestDetailsComponent } from './view-request-details.component';

describe('ViewRequestDetailsComponent', () => {
  let component: ViewRequestDetailsComponent;
  let fixture: ComponentFixture<ViewRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
