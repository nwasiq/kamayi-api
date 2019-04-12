import { TestBed } from '@angular/core/testing';

import { VacancyService } from './vacancy.service';

describe('VacancyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VacancyService = TestBed.get(VacancyService);
    expect(service).toBeTruthy();
  });
});
