import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HeadersInterceptor } from './headers.interceptor';

describe('HeadersInterceptor', () => {
  let client: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeadersInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HeadersInterceptor,
          multi: true,
        },
      ],
    });

    client = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const interceptor: HeadersInterceptor = TestBed.inject(HeadersInterceptor);
    expect(interceptor).toBeTruthy();
  });

  // it('should convert object keys to camelCase', (done) => {
  //   const body = { camel_case: true };
  //   const expected = { camelCase: true };

  //   client.get('/test').subscribe((response) => {
  //     expect(response).toEqual(expected);
  //     done();
  //   });

  //   const request = controller.expectOne('/test');
  //   request.flush(body);
  // });
});
