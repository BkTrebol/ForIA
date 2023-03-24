import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';

import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FontAwesomeTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [RegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return Form Invalid (empty)', () => {
    const form = component.formRegister;
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (only nick)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('test123');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (only email)', () => {
    const form = component.formRegister;
    const email = form.controls['email'];
    email.setValue('test@gmail.com');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (only password)', () => {
    const form = component.formRegister;
    const password = form.controls['password'];
    password.setValue('password');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (only password_confirmation)', () => {
    const form = component.formRegister;
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('password');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (all invalid)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('ab');
    const email = form.controls['email'];
    email.setValue('abcd');
    const password = form.controls['password'];
    password.setValue('1234567');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('7654321');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (nick invalid)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('ab');
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345678');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('12345678');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (nick invalid)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('ab');
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345678');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('12345678');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (email invalid)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('abc');
    const email = form.controls['email'];
    email.setValue('abcd');
    const password = form.controls['password'];
    password.setValue('12345678');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('12345678');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (password invalid)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('abc');
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('1234567');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('12345678');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (password_confirmation invalid)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('abc');
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345678');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('1234567');
    expect(form.invalid).toBeTrue();
  });

  it('should return Form Invalid (passwords dont\'t match)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('abc');
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345678');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('123456789');
    expect(form.invalid).toBeTrue();
  });

  it("should return Form Invalid (all valid)", () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('abc');
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345678');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('12345678');
    expect(form.valid).toBeTrue();
  });

  it('should have property error and user initialized', () => {
    expect(component.error).toBe('');
    expect(component.user).toEqual({
      nick: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
  });

});
