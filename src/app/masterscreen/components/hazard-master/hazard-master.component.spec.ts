import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HazardMasterComponent } from './hazard-master.component';

describe('HazardMasterComponent', () => {
  let component: HazardMasterComponent;
  let fixture: ComponentFixture<HazardMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HazardMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HazardMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
