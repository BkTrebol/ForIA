import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';

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

  it('HTML Form Invalid (empty)', () => {
    const form = component.formLogin;
    expect(form.invalid).toBeTrue();
  });

  it('HTML Form Invalid (only email)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('test@gmail.com');
    expect(form.invalid).toBeTrue();
  });

  it('HTML Form Invalid (only password)', () => {
    const form = component.formLogin;
    const password = form.controls['password'];
    password.setValue('password');
    expect(form.invalid).toBeTrue();
  });

  it('HTML Form Invalid (email and password invalid)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('abcd');
    const password = form.controls['password'];
    password.setValue('1234567');
    expect(form.invalid).toBeTrue();
  });

  it('HTML Form Invalid (email invalid and password valid)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('abcd');
    const password = form.controls['password'];
    password.setValue('12345678');
    expect(form.invalid).toBeTrue();
  });

  it('HTML Form Invalid (email valid and password invalid)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('1234567');
    expect(form.invalid).toBeTrue();
  });

  it('HTML Form Valid (email and password valid)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345678');
    expect(form.valid).toBeTrue();
  });

  it('HTML Form Valid (email, password and remember_me true valid)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345678');
    const remember_me = form.controls['remember_me'];
    remember_me.setValue(true);
    expect(form.valid).toBeTrue();
  });

  it('HTML Form Valid (email, password and remember_me false valid)', () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345678');
    const remember_me = form.controls['remember_me'];
    remember_me.setValue(false);
    expect(form.valid).toBeTrue();
  });

  // it('should return error because Form Invalid', () => {
  //   const form = component.formLogin;
  //   const email = component.formLogin.controls['email'];
  //   email.setValue('a@abcd');
  //   const password = component.formLogin.controls['password'];
  //   password.setValue('12345678');
  //   const remember_me = component.formLogin.controls['remember_me'];
  //   remember_me.setValue(false);
  //   expect(form.valid).toBeTrue();

  //   const btnElement = fixture.debugElement.query(By.css('.btn-send'));
  //   btnElement.nativeElement.click();
  //   expect(component.error).toEqual('Invalid data in the Form');
  // });

  it("HTML button disabled (email and password invalid)", () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('abc');
    const password = form.controls['password'];
    password.setValue('1234567');

    expect(form.valid).toBeFalse();
    const btn = fixture.nativeElement.querySelector('.btn-send');
    expect(btn.disabled).toBeTrue();
  });

  // it('HTML button not disabled (email and password valid)', () => {
  //   const form = component.formLogin;
  //   const email = form.controls['email'];
  //   email.setValue('a@a');
  //   const password = form.controls['password'];
  //   password.setValue('12345678');

  //   const btn = fixture.debugElement.nativeElement.querySelector('.btn-send');
  //   // expect(btn.disabled).toBeUndefined();
  //   // expect(
  //   //   btn.attributes.getNamedItem('ng-reflect-is-disabled').value
  //   // ).toBeTruthy();
  //   // expect(btn.attributes['disabled']).toBeUndefined();
  //   // expect(btn.disabled).toBeFalse();
  //   // expect(btn.nativeElement.getAttribute('disabled')).toEqual('');
  //   // expect(btn.attributes).toContain(['disabled']);
  //   // expect(Object.keys(btn.attributes)).toContain('disabled');
  //   // expect(btn.nativeElement.getAttribute('disabled')).toEqual('');

  //   // const h2: HTMLElement = fixture.nativeElement.querySelector('.btn-send');
  //   // const bgColor = h2.style.backgroundColor;
  //   // expect(bgColor).toBe('skyblue');
  //   // expect(btn.properties['disabled']).toBeUndefined();
  //   expect(form.valid).toBeTrue();
  // });

  it('HTML title, label and btn text', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('h2');
    const label = compiled.querySelector('label[for="remember"');
    const btn = compiled.querySelector('.btn-send');
    expect(title.textContent).toContain('Login');
    expect(label.textContent).toContain('Remember Me');
    expect(btn.textContent).toContain('Login');
  });

  it('TS error and authData initialized', () => {
    expect(component.error).toEqual('');
    expect(component.authData).toEqual({
      email: '',
      password: '',
      remember_me: false,
    });
  });

  it("TS error message don't change (email and password invalid)", () => {
    const form = component.formLogin;
    const email = form.controls['email'];
    email.setValue('abc');
    const password = form.controls['password'];
    password.setValue('1234567');

    const btnElement = fixture.debugElement.query(By.css('.btn-send'));
    btnElement.nativeElement.click();
    expect(component.error).toEqual('');
    expect(form.valid).toBeFalse();
  });

  it('TS submit should change error (invalid form)', () => {
    component.submit();
    expect(component.error).toEqual('Invalid data in the Form');
  });

});
