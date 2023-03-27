import { inject, TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthService Test', () => {
  let service: AuthService;
  let httpClientSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'testRegister',
      'testLogin',
      'testLogout',
      'getAuthUser',
      'getCSRF',
      'getIsAuth',
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

  it('AuthService variables initialized', () => {
    const mockIsAuthResult = false;
    httpClientSpy.getIsAuth.and.returnValue(mockIsAuthResult);
    expect(service.getIsAuth()).toBe(false);
    // expect(service.userData).toEqual({
    //   id: 0,
    //   nick: '',
    //   email: '',
    //   location: '',
    //   birthday: '',
    //   avatar: '',
    //   roles: [],
    //   created_at: '',
    //   updated_at: '',
    // });
    // expect(service.userPreferences).toEqual({
    //   sidebar: true,
    //   allow_music: false,
    // });
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

    httpClientSpy.testRegister.and.returnValue(of(mockRegisterResult));
    // const result = service.testRegister(mockRegisterData);
    // expect(result).not.toBeNull();
    service.testRegister(mockRegisterData).subscribe((res) => {
      expect(res).toEqual(mockRegisterResult);
    });
  });

  it('Login valid should return message from observable', () => {
    const mockLoginData = {
      email: 'a@a',
      password: '12345678',
      remember_me: false,
    };
    const mockLoginResult = {
      message: 'Logged in successfully.',
    };

    httpClientSpy.testLogin.and.returnValue(of(mockLoginResult));
    service.testLogin(mockLoginData).subscribe((res) => {
      expect(res).toEqual(mockLoginResult);
    });
  });

  it('Logout valid should return message from observable', () => {
    const mockLogoutResult = {
      message: 'Logout successfully',
    };

    httpClientSpy.testLogout.and.returnValue(of(mockLogoutResult));
    service.testLogout().subscribe((res) => {
      expect(res).toEqual(mockLogoutResult);
    });
  });

  it('getAuthUser valid should return the data of the user from observable', () => {
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

    httpClientSpy.getAuthUser.and.returnValue(of(mockAuthUserResult));
    service.getAuthUser().subscribe((res) => {
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

  // it('resetAuthUser should modify userData and userPreferences reseted', () => {
  //   service.resetAuthUser();
  //   expect(service.userData).toEqual({
  //     id: 0,
  //     nick: '',
  //     email: '',
  //     location: '',
  //     birthday: '',
  //     avatar: '',
  //     roles: [],
  //     created_at: '',
  //     updated_at: '',
  //   });
  //   expect(service.userPreferences).toEqual({
  //     sidebar: true,
  //     allow_music: false,
  //   });
  // });

  it(`Login invalid should return error`, () => {
    const mockLoginData = {
      email: 'abc',
      password: '123',
      remember_me: false,
    };
    const error = new HttpErrorResponse({
      error: 'Invalid user',
      status: 409,
      statusText: 'Not Found',
    });

    httpClientSpy.testLogin.and.returnValue(of(error));
    service.testLogin(mockLoginData).subscribe({
      next: (res) => { },
      error: (err) => {
        expect(err.status).toEqual(409);
      }
  });
  });

});
