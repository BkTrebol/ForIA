import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { UserService } from '../../service/user.service';
import { PublicUserProfile } from 'src/app/models/receive/user-profile';
import { Global } from 'src/environment/global';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { EChartsOption } from 'echarts';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../../../../styles/card.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public id: string;
  public user: PublicUserProfile;
  public url: string;
  public theme: string;
  public userAuth: User;
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
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService,
    private http: HttpClient
  ) {
    this.unsubscribe$ = new Subject();
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
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
      is_verified: true,
    };
    this.userAuth = this.authService.user?.userData;
    this.theme = themeService.getTheme();
    this.view = true;
    this.loading = false;

    this.chartOption = {};
    this.chartOption2 = {};
    this.chartFirst = true;
  }

  ngOnInit(): void {
    if (this.route.snapshot.data['response']) {
      this.user = this.route.snapshot.data['response'];
      //this.user.id == this.userAuth.id && !this.userAuth.isVerified
      if (this.user?.id == 0 && !this.userAuth.isVerified) {
        this.toastService.show('Verify your email');
      }
    } else {
      this.router.navigate(['/error']);
    }

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
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow',
                },
              },
              xAxis: {
                type: 'category',
                data: Object.keys(res.topics),
                axisTick: {
                  alignWithLabel: true,
                },
              },
              yAxis: {
                type: 'value',
              },
              series: [
                {
                  name: 'Posts',
                  barWidth: '50%',
                  data: Object.values(res.topics),
                  type: 'bar',
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
          this.chartOption = {
            title: {
              left: '50%',
              text: 'Activity',
              textAlign: 'center',
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b} : {c} ({d}%)',
            },
            legend: {
              align: 'auto',
              bottom: 10,
              data: ['posts', 'topics', 'messages send', 'messages recived'],
            },
            calculable: true,
            series: [
              {
                name: 'activity',
                type: 'pie',
                radius: '55%',
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
