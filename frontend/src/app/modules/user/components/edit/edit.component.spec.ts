import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditComponent } from './edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

// Check if the button .btn-send is disabled or not
function checkBtn(is: boolean, fixture: ComponentFixture<EditComponent>) {
  const btn = fixture.nativeElement.querySelector('.btn-send');
  fixture.detectChanges();
  expect(btn.disabled).toBe(is);
}

describe('EditComponent Test', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FontAwesomeTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [EditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('HTML Form Invalid (empty)', () => {
    const form = component.formEditProfile;
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (only nikc)', () => {
    const form = component.formEditProfile;
    const nick = form.controls['nick'];
    nick.setValue('abcd');
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (only email)', () => {
    const form = component.formEditProfile;
    const email = form.controls['email'];
    email.setValue('test@gmail.com');
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (nikc invalid)', () => {
    const form = component.formEditProfile;
    const nick = form.controls['nick'];
    nick.setValue('a');
    const email = form.controls['email'];
    email.setValue('test@gmail.com');
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Invalid (email invalid)', () => {
    const form = component.formEditProfile;
    const nick = form.controls['nick'];
    nick.setValue('abcd');
    const email = form.controls['email'];
    email.setValue('abc');
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML Form Valid (all valid)', () => {
    const form = component.formEditProfile;
    const nick = form.controls['nick'];
    nick.setValue('abcd');
    const email = form.controls['email'];
    email.setValue('a@a');
    const location = form.controls['location'];
    location.setValue('Barcelona');
    const birthday = form.controls['birthday'];
    birthday.setValue('11-10-2020');
    const avatar = form.controls['avatar'];
    avatar.setValue('');
    expect(form.valid).toBeTrue();
    checkBtn(false, fixture)
  });

  it('HTML Form Valid (all valid three empty)', () => {
    const form = component.formEditProfile;
    const nick = form.controls['nick'];
    nick.setValue('abcd');
    const email = form.controls['email'];
    email.setValue('a@a');
    const location = form.controls['location'];
    location.setValue('');
    const birthday = form.controls['birthday'];
    birthday.setValue('');
    const avatar = form.controls['avatar'];
    avatar.setValue('');
    expect(form.valid).toBeTrue();
    checkBtn(false, fixture);
  });

  it('HTML Form Valid (all invalid)', () => {
    const form = component.formEditProfile;
    const nick = form.controls['nick'];
    nick.setValue('a');
    const email = form.controls['email'];
    email.setValue('abc');
    expect(form.invalid).toBeTrue();
    checkBtn(true, fixture);
  });

  it('HTML title, label birthday, email and btn text', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('h2');
    const birthday = compiled.querySelector('label[for="birthday"');
    const label = compiled.querySelector('label[for="file"');
    const btn = compiled.querySelector('.btn-send');
    expect(title.textContent).toContain('Edit Profile');
    expect(birthday.textContent).toContain('Birthday');
    expect(label.textContent).toContain('Avatar');
    expect(btn.textContent).toContain('Edit Profile');
  });

  it('TS property error, loading and user initialized', () => {
    expect(component.error).toBe('');
    expect(component.loading).toBe(false);
    expect(component.user).toEqual({
      nick: '',
      email: '',
      location: '',
      birthday: '',
      avatar: '',
    });
  });

  it("TS error message don't change (all invalid)", () => {
    const form = component.formEditProfile;
    const nick = form.controls['nick'];
    nick.setValue('a');
    const email = form.controls['email'];
    email.setValue('abcd');

    const btnElement = fixture.debugElement.query(By.css('.btn-send'));
    btnElement.nativeElement.click();
    expect(component.error).toEqual('');
    expect(form.valid).toBeFalse();
    checkBtn(true, fixture);
  });

  it('TS submit should change error (invalid form)', () => {
    component.submit();
    expect(component.error).toEqual('Invalid data in the Form');
    expect(component.loading).toBeFalse();
    checkBtn(true, fixture);
  });
});
