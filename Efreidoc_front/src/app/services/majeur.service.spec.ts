import { TestBed } from '@angular/core/testing';

import { MajeurService } from './majeur.service';

describe('MajeurService', () => {
  let service: MajeurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MajeurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
