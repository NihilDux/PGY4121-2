import { TestBed } from '@angular/core/testing';

import { LocalapiService } from './localapi.service';

describe('LocalapiService', () => {
  let service: LocalapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
