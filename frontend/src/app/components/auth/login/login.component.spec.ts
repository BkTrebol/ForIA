import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
// import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent Test', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FontAwesomeTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return Form Invalid (empty)', () => {
    const form = component.formLogin;
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (only email)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('test@gmail.com');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (only password)', () => {
    const form = component.formLogin;
    const password = form.controls['password'];
    password.setValue('password');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (email and password invalid)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('abcd');
    const password = form.controls['password'];
    password.setValue('1234567');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (email invalid and password valid)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('abcd');
    const password = form.controls['password'];
    password.setValue('12345678');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (email valid and password invalid)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('1234567');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Valid (email and password valid)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345678');
    expect(form.valid).toBeTrue();
  });

  it('should return Form Valid (email and password and remember_me valid)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345678');
    const remember_me = form.controls['remember_me'];
    remember_me.setValue(true);
    expect(form.valid).toBeTrue();
  });

  // it('should return error because Form Invalid', () => {
  //   const fixture = TestBed.createComponent(LoginComponent);
  //   const app = fixture.componentInstance;
  //   fixture.detectChanges();

  //   const form = app.formLogin;
  //   const email = app.formLogin.controls['email'];
  //   email.setValue('a@abcd');
  //   const password = app.formLogin.controls['password'];
  //   password.setValue('12345678');
  //   const remember_me = app.formLogin.controls['remember_me'];
  //   remember_me.setValue(false);

  //   const btnElement = fixture.debugElement.query(By.css('button.btn-send'));
  //   btnElement.nativeElement.click();
  //   expect(app.error).toBe('Invalid data in the Form');
  // });

  it('should have property error and authData initialized', () => {
    expect(component.error).toBe('');
    expect(component.authData).toEqual({
      email: '',
      password: '',
      remember_me: false,
    });
  });

});
