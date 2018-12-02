import { TestBed, inject } from '@angular/core/testing';

import { ObservationConstantsService } from './observation-constants.service';

describe('ObservationConstantsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObservationConstantsService]
    });
  });

  it('should be created', inject([ObservationConstantsService], (service: ObservationConstantsService) => {
    expect(service).toBeTruthy();
  }));
});
