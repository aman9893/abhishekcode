import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifierViewDetailsComponent } from './verifier-view-details.component';

describe('VerifierViewDetailsComponent', () => {
  let component: VerifierViewDetailsComponent;
  let fixture: ComponentFixture<VerifierViewDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifierViewDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifierViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
