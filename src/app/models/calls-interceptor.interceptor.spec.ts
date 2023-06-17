import { TestBed } from '@angular/core/testing';

import { CallsInterceptorInterceptor } from './calls-interceptor.interceptor';

describe('CallsInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CallsInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: CallsInterceptorInterceptor = TestBed.inject(CallsInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
