import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SharedModule } from 'src/app/modules/share.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

// Check if the button .btn-send is disabled or not
function checkBtn(is: boolean, fixture: ComponentFixture<RegisterComponent>) {
  const btn = fixture.nativeElement.querySelector('.btn-send');
  fixture.detectChanges();
  expect(btn.disabled).toBe(is);
}

describe('RegisterComponent Test', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FontAwesomeTestingModule,
        ReactiveFormsModule,
        SharedModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
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

  it('HTML Form Invalid (empty)', () => {
    const form = component.formRegister;
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (only nick)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('test123');
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (only email)', () => {
    const form = component.formRegister;
    const email = form.controls['email'];
    email.setValue('test@gmail.com');
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (only password)', () => {
    const form = component.formRegister;
    const password = form.controls['password'];
    password.setValue('password');
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (only password_confirmation)', () => {
    const form = component.formRegister;
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('password');
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (all invalid)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('ab');
    const email = form.controls['email'];
    email.setValue('abcd');
    const password = form.controls['password'];
    password.setValue('1234567');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('7654321');
    const terms = form.controls['terms'];
    terms.setValue(false);
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (nick invalid)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('ab');
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345678');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('12345678');
    const terms = form.controls['terms'];
    terms.setValue(true);
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (email invalid)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('abc');
    const email = form.controls['email'];
    email.setValue('abcd');
    const password = form.controls['password'];
    password.setValue('12345678');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('12345678');
    const terms = form.controls['terms'];
    terms.setValue(true);
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (password invalid)', () => {
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
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (password_confirmation invalid)', () => {
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
    checkBtn(true, fixture);
  });

  it("HTML Form Invalid (passwords dont't match)", () => {
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
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (invalid terms)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('abc');
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345678');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('12345678');
    const terms = form.controls['terms'];
    terms.setValue(false);
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Valid (all valid)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('abc');
    const email = form.controls['email'];
    email.setValue('a@a');
    const password = form.controls['password'];
    password.setValue('12345aA!');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('12345aA!');
    const terms = form.controls['terms'];
    terms.setValue(true);
    expect(form.valid).toBeTrue();
    checkBtn(false, fixture);
  });

  it('HTML button disabled (all invalid)', () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('a');
    const email = form.controls['email'];
    email.setValue('abcd');
    const password = form.controls['password'];
    password.setValue('1234567');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('123456');
    const terms = form.controls['terms'];
    terms.setValue(false);
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML title, (label) and btn text', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('h2');
    // const label = compiled.querySelector('label[for="remember"');
    const btn = compiled.querySelector('.btn-send');
    expect(title.textContent).toBeTruthy();
    // expect(label.textContent).toContain('Remember Me');
    expect(btn.textContent).toBeTruthy();
  });

  it('TS property error, loading and user initialized', () => {
    expect(component.error).toBe('');
    expect(component.loading).toBe(false);
  });

  it("TS error message don't change (all invalid)", () => {
    const form = component.formRegister;
    const nick = form.controls['nick'];
    nick.setValue('a');
    const email = form.controls['email'];
    email.setValue('abcd');
    const password = form.controls['password'];
    password.setValue('1234567');
    const password_confirmation = form.controls['password_confirmation'];
    password_confirmation.setValue('123456');

    const btnElement = fixture.debugElement.query(By.css('.btn-send'));
    btnElement.nativeElement.click();
    expect(component.error).toEqual('');
    expect(form.valid).toBeFalse();
    checkBtn(true, fixture);
  });

  it('TS submit should change error (invalid form)', () => {
    component.submit();
    expect(component.error).toBeTruthy();
    expect(component.loading).toBeFalse();
    checkBtn(true, fixture);
  });
});
