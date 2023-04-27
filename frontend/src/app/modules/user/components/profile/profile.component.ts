import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { UserService } from '../../service/user.service';
import { PublicUserProfile } from 'src/app/models/receive/user-profile';
import { Global } from 'src/app/environment/global';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { EChartsOption } from 'echarts';
import { HttpClient } from '@angular/common/http';

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
  public view: boolean;
  public loading: boolean;
  public chartOption: EChartsOption;
  public options?: Observable<any>;

  constructor(
    private userSerivce: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService,
    private http: HttpClient
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
    this.view = true;
    this.loading = false;

    this.chartOption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
        },
      ],
    };

    // this.chartOption = new Observable;
  }

  ngOnInit(): void {
    if (this.route.snapshot.data['response']) {
      this.user = this.route.snapshot.data['response'];
      if (this.user.id.toString() == this.userId) {
        this.toastService.show('Verify your email');
      }
    } else {
      this.router.navigate(['/error']);
    }
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });

    this.options = this.http
      .get('assets/data/life-expectancy-table.json', { responseType: 'json' })
      .pipe(
        map((data) => ({
          grid3D: {},
          tooltip: {},
          xAxis3D: {
            type: 'category',
          },
          yAxis3D: {
            type: 'category',
          },
          zAxis3D: {},
          visualMap: {
            max: 1e8,
            dimension: 'Population',
          },
          dataset: {
            dimensions: [
              'Income',
              'Life Expectancy',
              'Population',
              'Country',
              { name: 'Year', type: 'ordinal' },
            ],
            source: data,
          },
          series: [
            {
              type: 'bar3D',
              // symbolSize: symbolSize,
              shading: 'lambert',
              encode: {
                x: 'Year',
                y: 'Country',
                z: 'Life Expectancy',
                tooltip: [0, 1, 2, 3, 4],
              },
            },
          ],
        }))
      );
  }

  toggleView(): void {
    this.view = !this.view;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
