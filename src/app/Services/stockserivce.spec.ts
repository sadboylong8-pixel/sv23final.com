import { TestBed } from '@angular/core/testing';

import { Stockserivce } from './stockserivce';

describe('Stockserivce', () => {
  let service: Stockserivce;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Stockserivce);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
