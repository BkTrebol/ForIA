import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

describe('AuthService Test', () => {
  let service: AuthService;
  let httpClientSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    //AuthService
    httpClientSpy = jasmine.createSpyObj<any>('AuthService', [
      'getCSRF',
      'register',
      'login',
      'checkLogin',
      'autoAuthUser',
      'logout',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        // AuthService,
        { provide: AuthService, useValue: httpClientSpy },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Register valid should return message from observable', () => {
    const mockRegisterData = {
      nick: 'abcd',
      email: 'a@a',
      password: '12345678',
      password_confirmation: '12345678',
    };
    const mockRegisterResult = {
      message: 'User created successfully',
    };

    httpClientSpy.register.and.returnValue(of(mockRegisterResult));
    service.register(mockRegisterData).subscribe((res) => {
      expect(res).toEqual(mockRegisterResult);
    });
  });

  // it('Login valid should return message from observable', () => {
  //   const mockLoginData = {
  //     email: 'a@a',
  //     password: '12345678',
  //     remember_me: false,
  //   };
  //   const mockLoginResult = {
  //     message: 'Logged in successfully.',
  //   };

  //   httpClientSpy.login.and.returnValue(of(mockLoginResult));
  //   httpClientSpy.checkLogin.and.returnValue(of(""));
  //   service.login(mockLoginData).subscribe(res => {
  //     expect(res).toEqual(mockLoginResult);
  //   })
  //   });
  // });

  it('Logout valid should return message from observable', () => {
    const mockLogoutResult = {
      message: 'Logout successfully',
    };

    httpClientSpy.logout.and.returnValue(of(mockLogoutResult));
    service.logout().subscribe((res) => {
      expect(res).toEqual(mockLogoutResult);
    });
  });

  it('checkLogin valid should return the data of the user from observable', () => {
    const mockAuthUserResult = {
      userData: {
        id: 13,
        nick: 'root',
        email: 'root@admin.su',
        location: null,
        birthday: null,
        avatar: null,
        roles: ['ROLE_USER'],
        created_at: '2023-03-25T10:50:00.000000Z',
        updated_at: '2023-03-25T10:50:00.000000Z',
      },
      userPreferences: {
        sidebar: 1,
        allow_music: 1,
      },
    };

    httpClientSpy.checkLogin.and.returnValue(of(mockAuthUserResult));
    service.checkLogin().subscribe((res) => {
      expect(res).toEqual(mockAuthUserResult);
    });
  });

  it('getCSRF valid should return status code 204 No Content from observable', () => {
    const mockCSRFResult = '';

    httpClientSpy.getCSRF.and.returnValue(of(mockCSRFResult));
    service.getCSRF().subscribe((res) => {
      expect(res).toEqual(mockCSRFResult);
    });
  });

  // it(`Login invalid should return error`, () => {
  //   const mockLoginData = {
  //     email: 'abc',
  //     password: '123',
  //     remember_me: false,
  //   };
  //   const error = new HttpErrorResponse({
  //     error: 'Invalid user',
  //     status: 409,
  //     statusText: 'Not Found',
  //   });

  //   httpClientSpy.login.and.returnValue(of(error));
  //   service.login(mockLoginData).subscribe({
  //     next: (res) => {},
  //     error: (err) => {
  //       expect(err.status).toEqual(409);
  //     },
  //   });
  // });
});
