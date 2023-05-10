import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgbDateStruct, NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  private _userId:number;
  public editUserForm:FormGroup;
  public loading:boolean;
  public roleList:Array<any>;
  public user:any;
  public dateToday:NgbDateStruct;
  public nickUnique:number | null;
  public emailUnique:number | null;
  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private fb: FormBuilder,
  ){
    const dateNow = new Date();
    this.dateToday = {
      year: dateNow.getFullYear(),
      month: dateNow.getMonth()+1,
      day: dateNow.getDate(),
    };
    this.nickUnique = NaN;
    this.emailUnique = NaN;
    this._userId = 0;
    this.unsubscribe$ = new Subject();
    this.roleList = [];
    this.loading = true;
    this.editUserForm = this.fb.group({
      nick: [],
      email: [],
      email_verified_at: [],
      password: [null],
      location: [],
      birthday: [],
      avatar: [],
      rol: [],
      suspension: [],
      roles:[]
    });
  }

  ngOnInit() {
    this._userId = this._route.snapshot.params['id']
    this.getData()
    this.getRoles();
  }

  getData(){
    this.loading = true;
    this._userService.getUser(this._userId)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: r => {
        console.log(r);
        this.loading = false;
        this.user = r;
        this.populateForm();
      }
    });
  }

  populateForm(){
    const userRoles = this.user.roles.map((role:any) => role.id);
    this.editUserForm = this.fb.group({
      nick: [this.user.nick, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      email_verified_at: [this.user.verified],
      password: [null],
      location: [this.user.location],
      birthday: [this.parseDateToPicker(this.user.birthday)],
      avatar: [this.user.avatar],
      rol: [this.user.rol],
      suspension: [this.parseDateToPicker(this.user.suspension)],
      roles:[userRoles]
    });
  }

  parseDateToPicker(date:any){
    if(date === null){
      return null;
    }
    const dateToParse = new Date(date);
    return {year:dateToParse.getFullYear(), month:dateToParse.getMonth() + 1, day:dateToParse.getDate()};
  }

  parsePickerDate(date:any){
    if(date === null){
      return null;
    }
    return new Date(`${date.year}/${date.month}/${date.day}`);  
  }

  getRoles(){
    this._userService.getRoles()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: r => {
        this.roleList = r;
      }
    })
  }
  checkNick(){
    if (this.nick?.valid && this.nick?.value !== this.user.nick){
      this._userService.checkNick(this.nick.value,this.user.nick)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((r) => {
        console.log(r);
        if(r !== false){
          this.nickUnique = r;
          this.nick?.setErrors({})
        }
      })
    }
  }

  checkEmail(){
    if (this.email?.valid && this.email.value !== this.user.email){
      this._userService.checkEmail(this.email.value,this.user.email)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((r) => {
        console.log(r);
        if(r !== false){
          this.emailUnique = r;
          this.email?.setErrors({ unique: true})
        }
      })
    }
  }
  onSubmit() {

    if (this.editUserForm.valid) {
      this.editUserForm.value.birthday = this.parsePickerDate(this.editUserForm.value.birthday);
      this.editUserForm.value.suspension = this.parsePickerDate(this.editUserForm.value.suspension);
      console.log(this.editUserForm.value)
      this._userService.updateUser(this.editUserForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        console.log(data)
      });
    }
  }

  focusDateInput(inputElement: HTMLElement) {
    inputElement.focus();
  }

  get nick() { return this.editUserForm.get('nick')}
  get email() { return this.editUserForm.get('email')};

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
