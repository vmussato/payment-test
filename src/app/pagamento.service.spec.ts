import { TestBed } from '@angular/core/testing';

import { PagamentoService } from './pagamento.service';

describe('PagamentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PagamentoService = TestBed.get(PagamentoService);
    expect(service).toBeTruthy();
  });
});
