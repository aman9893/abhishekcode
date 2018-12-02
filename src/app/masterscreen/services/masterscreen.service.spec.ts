import { TestBed, inject } from '@angular/core/testing';

import { MasterscreenService } from './masterscreen.service';

describe('MasterscreenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterscreenService]
    });
  });

  it('should be created', inject([MasterscreenService], (service: MasterscreenService) => {
    expect(service).toBeTruthy();
  }));
});
