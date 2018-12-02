import { TestBed, inject } from '@angular/core/testing';

import { ActiontrackerConstantsService } from './actiontracker-constants.service';

describe('ActiontrackerConstantsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiontrackerConstantsService]
    });
  });

  it('should be created', inject([ActiontrackerConstantsService], (service: ActiontrackerConstantsService) => {
    expect(service).toBeTruthy();
  }));
});
