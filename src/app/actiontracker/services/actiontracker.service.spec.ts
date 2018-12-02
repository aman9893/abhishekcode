import { TestBed, inject } from '@angular/core/testing';

import { ActiontrackerService } from './actiontracker.service';

describe('ActiontrackerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiontrackerService]
    });
  });

  it('should be created', inject([ActiontrackerService], (service: ActiontrackerService) => {
    expect(service).toBeTruthy();
  }));
});
