import { TestBed } from '@angular/core/testing';

import { Staffservice } from './staffservice';

describe('Staffservice', () => {
  let service: Staffservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Staffservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
