import { TestBed, inject } from '@angular/core/testing';

import { MasterscreenConstantsService } from './masterscreen-constants.service';

describe('MasterscreenConstantsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterscreenConstantsService]
    });
  });

  it('should be created', inject([MasterscreenConstantsService], (service: MasterscreenConstantsService) => {
    expect(service).toBeTruthy();
  }));
});
