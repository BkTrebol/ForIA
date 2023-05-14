import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { UserService } from '../../service/user.service';
import { PublicUserProfile } from 'src/app/models/receive/user-profile';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { EChartsOption } from 'echarts';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../../../../styles/card.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public id: string;
  public user: PublicUserProfile;
  public url: string;
  public theme: string;
  public userAuth: User | null;
  public view: boolean;
  public loading: boolean;
  public chartOption: EChartsOption;
  public options?: Observable<any>;
  public chartOption2: EChartsOption;
  public chartFirst: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private toastService: ToastService,
    private http: HttpClient,
    private _translateService: TranslateService
  ) {
    this.unsubscribe$ = new Subject();
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.url = environment.api + 'user/get-avatar/';
    this.user = {
      id: 0,
      nick: '',
      email: '',
      location: '',
      birthday: '',
      avatar: '',
      public_role: {
        name: '',
        description: '',
      },
      created_at: '',
      last_seen: '',
      can_pm: false,
      is_verified: true,
    };
    this.userAuth = null;
    this.theme = themeService.getTheme();
    this.view = true;
    this.loading = true;

    this.chartOption = {};
    this.chartOption2 = {};
    this.chartFirst = true;
  }

  ngOnInit(): void {
    this.userService
      .getProfile(this.route.snapshot.paramMap.get('id') ?? '')
      .subscribe({
        next: (res) => {
          this.user = res;
          if (
            this.userAuth &&
            this.user.id == this.userAuth.id &&
            !this.userAuth.isVerified
          ) {
            this.toastService.show(
              this._translateService.instant('VERIFY_EMAIL')
            );
          } else {
            this.userAuth = this.authService.user?.userData;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.loading = false;
        },
      });

    this.authService.authData.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (r) => {
        this.userAuth = r != null ? r.userData : null;
      },
    });

    this.getStatistics();
    this.getPostsTopic();

    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((_: Params) => {
        this.id = this.route.snapshot.paramMap.get('id') ?? '';
        this.getUserProfile();
        this.getStatistics();
        this.getPostsTopic();
      });

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

  getPostsTopic(): void {
    this.userService
      .getPostsTopic(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          if (res.topics.length == 0) {
            this.chartOption2 = {
              title: {
                left: '50%',
                text: 'No Topics',
                textAlign: 'center',
              },
            };
          } else {
            this.chartOption2 = {
              title: {
                left: '50%',
                text: 'Topics',
                subtext: 'Total of Posts',
                textAlign: 'center',
                textStyle: {
                  fontSize: '30',
                },
                subtextStyle: {
                  fontSize: '20',
                },
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow',
                },
                textStyle: {
                  fontSize: '25',
                },
              },
              xAxis: {
                type: 'category',
                data: Object.keys(res.topics),
                axisTick: {
                  alignWithLabel: true,
                },
                axisLabel: {
                  fontSize: '20',
                },
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  fontSize: '20',
                },
              },
              series: [
                {
                  name: 'Posts',
                  barWidth: '50%',
                  data: Object.values(res.topics),
                  type: 'bar',
                  label: {
                    fontSize: '20',
                  },
                },
              ],
            };
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getStatistics(): void {
    this.userService
      .getStatistics(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          // console.log(res);
          // this.chartOption = {
          //   xAxis: {
          //     type: 'category',
          //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          //   },
          //   yAxis: {
          //     type: 'value',
          //   },
          //   series: [
          //     {
          //       data: [820, 932, 901, 934, 1290, 1330, 1320],
          //       type: 'line',
          //     },
          //   ],
          // };
          if (res.no) {
            this.chartOption = {
              title: {
                left: '50%',
                text: 'Activity',
                textAlign: 'center',
                textStyle: {
                  fontSize: '30',
                },
              },
              tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)',
                textStyle: {
                  fontSize: '25',
                },
              },
              legend: {
                align: 'auto',
                bottom: 10,
                textStyle: {
                  fontSize: '20',
                },
                data: ['posts', 'topics'],
              },
              calculable: true,
              series: [
                {
                  name: 'activity',
                  type: 'pie',
                  radius: '55%',
                  label: {
                    fontSize: 20,
                  },
                  center: ['50%', '50%'],
                  data: [
                    { value: res.posts.length, name: 'posts' },
                    { value: res.topics.length, name: 'topics' },
                  ].sort((a, b) => a.value - b.value),
                },
              ],
            };
          } else {
            this.chartOption = {
              title: {
                left: '50%',
                text: 'Activity',
                textAlign: 'center',
                textStyle: {
                  fontSize: '30',
                },
              },
              tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)',
                textStyle: {
                  fontSize: '25',
                },
              },
              legend: {
                align: 'auto',
                bottom: 10,
                textStyle: {
                  fontSize: '20',
                },
                data: ['posts', 'topics', 'messages send', 'messages recived'],
              },
              calculable: true,
              series: [
                {
                  name: 'activity',
                  type: 'pie',
                  radius: '55%',
                  label: {
                    fontSize: 20,
                  },
                  // roseType: 'area',
                  // roseType: 'radius',
                  center: ['50%', '50%'],
                  data: [
                    { value: res.posts.length, name: 'posts' },
                    { value: res.topics.length, name: 'topics' },
                    {
                      value: res.private_message_sender.length,
                      name: 'messages send',
                    },
                    {
                      value: res.private_message_reciever.length,
                      name: 'messages recived',
                    },
                  ].sort((a, b) => a.value - b.value),
                },
              ],
            };
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getUserProfile(): void {
    this.userService.getProfile(this.id).subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleView(): void {
    this.view = !this.view;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
