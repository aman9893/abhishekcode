import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifierDashboardComponent } from './verifier-dashboard.component';

describe('VerifierDashboardComponent', () => {
  let component: VerifierDashboardComponent;
  let fixture: ComponentFixture<VerifierDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifierDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifierDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
