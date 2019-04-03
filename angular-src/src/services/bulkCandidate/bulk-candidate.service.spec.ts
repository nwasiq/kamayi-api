import { TestBed } from '@angular/core/testing';

import { BulkCandidateService } from './bulk-candidate.service';

describe('BulkCandidateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BulkCandidateService = TestBed.get(BulkCandidateService);
    expect(service).toBeTruthy();
  });
});
