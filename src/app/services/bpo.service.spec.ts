import { TestBed } from '@angular/core/testing';

import { BPOService } from './bpo.service';

describe('BPOService', () => {
  let service: BPOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BPOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
