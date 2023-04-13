import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../service/user.service';
import { PublicUserProfile } from 'src/app/models/receive/user-profile';
import { Global } from 'src/app/environment/global';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../../../../styles/card.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public user: PublicUserProfile;
  public url: string;
  public id: string;

  constructor(
    private userSerivce: UserService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    this.unsubscribe$ = new Subject();
    this.url = Global.api + 'user/get-avatar/';
    this.id = '';
    this.user = {
      nick: '',
      email: '',
      location: '',
      birthday: '',
      avatar: '',
      rol: '',
      created_at: '',
      updated_at: '',
      can_pm: false,
    };
  }

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get('id') ?? '';
    // if (this.id == '') {
    //   this.router.navigate(['/']);
    // }
    // this.userSerivce
    //   .getProfile(this.id)
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe({
    //     next: (res) => {
    //       this.user = res;
    //     },
    //     error: (err) => {
    //       console.log(err);
    //       this.router.navigate(['/']);
    //     },
    //   });
    if (this.route.snapshot.data['response']) {
      this.user = this.route.snapshot.data['response'];
    } else {
      this.router.navigate(['/user/profile']);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
