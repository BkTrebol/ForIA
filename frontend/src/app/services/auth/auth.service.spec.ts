import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';

describe('AuthService Test', () => {
  let service: AuthService;
  let httpGetClientSpy: { get: jasmine.Spy };
  let httpPostClientSpy: { post: jasmine.Spy };

  beforeEach(() => {
    httpGetClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpPostClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getIsAuth should return false', () => {
    expect(service.getIsAuth()).toBe(false);
  });

  it('should have property userData initialized', () => {
    expect(service.userData).toEqual({
      id: 0,
      nick: '',
      email: '',
      location: '',
      birthday: '',
      avatar: '',
      roles: [],
      created_at: '',
      updated_at: '',
    });
  });

  it('should have property userPreferences initialized', () => {
    expect(service.userPreferences).toEqual({
      sidebar: true,
      allow_music: false,
    });
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

    httpPostClientSpy.post.and.returnValue(of(mockRegisterResult));

    service.testRegister(mockRegisterData).subscribe((res) => {
      expect(res).toBe(mockRegisterResult);
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

    httpPostClientSpy.post.and.returnValue(of(mockLoginResult));

    service.testLogin(mockLoginData).subscribe((res) => {
      expect(res).toBe(mockLoginResult);
    });
  });

  it('Logout valid should return message from observable', () => {
    const mockLogoutResult = {
      message: 'Logout successfully',
    };

    httpGetClientSpy.get.and.returnValue(of(mockLogoutResult));

    service.testLogout().subscribe((res) => {
      expect(res).toBe(mockLogoutResult);
    });
  });

  it('getUserData valid should return the data of the user from observable', () => {
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

    httpGetClientSpy.get.and.returnValue(of(mockAuthUserResult));

    service.getAuthUser().subscribe((res) => {
      expect(res).toBe(mockAuthUserResult);
    });
  });

  it('TODO getCSRF valid should return status code 204 No Content from observable', () => {
    const mockCSRFResult = "";

    httpGetClientSpy.get.and.returnValue(of(mockCSRFResult));

    service.getCSRF().subscribe((res) => {
      expect(res).toBe(mockCSRFResult);
    });
  });

  it('resetAuthUser should modify userData and userPreferences reseted', () => {
    service.resetAuthUser();
    expect(service.userData).toEqual({
      id: 0,
      nick: '',
      email: '',
      location: '',
      birthday: '',
      avatar: '',
      roles: [],
      created_at: '',
      updated_at: '',
    });
    expect(service.userPreferences).toEqual({
      sidebar: true,
      allow_music: false,
    });
  });

  // it('autoAuthUser valid should return the data of the user from observable', () => {
  //   const mockAuthDataResult = {};

  //   httpGetClientSpy.get.and.returnValue(of(mockAuthDataResult));

  //   service.autoAuthUser();

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

  // get CSRF token
});
