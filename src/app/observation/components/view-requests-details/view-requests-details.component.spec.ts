import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestsDetailsComponent } from './view-requests-details.component';

describe('ViewRequestsDetailsComponent', () => {
  let component: ViewRequestsDetailsComponent;
  let fixture: ComponentFixture<ViewRequestsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRequestsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequestsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
