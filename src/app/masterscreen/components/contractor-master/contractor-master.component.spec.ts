import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorMasterComponent } from './contractor-master.component';

describe('ContractorMasterComponent', () => {
  let component: ContractorMasterComponent;
  let fixture: ComponentFixture<ContractorMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractorMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
