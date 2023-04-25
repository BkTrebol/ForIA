import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../service/user.service';
import { PublicUserProfile } from 'src/app/models/receive/user-profile';
import { Global } from 'src/app/environment/global';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../../../../styles/card.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public user: PublicUserProfile;
  public url: string;
  public theme: string;
  public userId: string;

  constructor(
    private userSerivce: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService
  ) {
    this.unsubscribe$ = new Subject();
    this.url = Global.api + 'user/get-avatar/';
    this.user = {
      id: 0,
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
    this.userId = this.authService.user?.userData.id;
    this.theme = themeService.getTheme();
  }

  ngOnInit(): void {
    if (this.route.snapshot.data['response']) {
      this.user = this.route.snapshot.data['response'];
      if (this.user.id.toString() == this.userId) {
        this.toastService.show('Verify your email')
      }
    } else {
      this.router.navigate(['/error']);
    }
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
