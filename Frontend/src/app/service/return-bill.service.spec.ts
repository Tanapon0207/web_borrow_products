import { TestBed } from '@angular/core/testing';

import { ReturnBillService } from './return-bill.service';

describe('ReturnBillService', () => {
  let service: ReturnBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
