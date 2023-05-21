import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ListTopics } from 'src/app/models/receive/list-topics';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { CategoryService } from '../../service/category.service';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../styles/card.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public isMusic: boolean;
  public audio: HTMLAudioElement;
  public theme: string;
  public listTopics: ListTopics;
  public userLogged: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.isMusic = false;
    this.audio = new Audio();
    this.theme = this.themeService.getTheme();
    this.userLogged = this.authService.user;
    this.listTopics = {
      category: {
        id: 0,
        title: '',
        can_post: false,
      },
      topics: [],
      page: {
        total: 1,
        current: 1,
        last: 1,
      },
    };
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: Params) => {
        this.loading = true;
        this.getData(params['id'], '1');
      });

    this.getData(
      this.route.snapshot.paramMap.get('id') ?? '',
      this.route.snapshot.queryParams['page'] ?? '1'
    );

    this.authService.authData.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (r) => {
        this.userLogged = r;
      },
    });

    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  getData(id: string, page: string) {
    this.categoryService
      .topics(id, page)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.listTopics = res;
          this.loading = false;
          if (
            parseInt(this.route.snapshot.queryParams['page'] ?? '1') !=
            res.page.current
          ) {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { page: this.listTopics.page.current },
              queryParamsHandling: 'merge',
            });
          }

          if (this.route.snapshot.fragment == 'last') {
            setTimeout(() => {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
              });
            }, 100);
          } else {
            this.scrollToTop();
          }

          if (
            !this.userLogged ||
            (this.userLogged && this.userLogged.userPreferences.allow_music)
          ) {
            this.getMusic(this.listTopics.category.id.toString());
          }
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/error']);
        },
      });
  }

  changePage(page: number) {
    this.getData(this.listTopics.category.id.toString(), page.toString());
  }

  getMusic(id: string): void {
    this.audio.src = `${environment.api}category/music/${id}`;
    this.audio.load();
    const isPlaying = this.audio.play();
    this.audio.volume = 0.3;
    if (isPlaying !== undefined) {
      isPlaying
        .then(() => {
          this.isMusic = true;
        })
        .catch(() => {
          this.isMusic = false;
        });
    }
  }

  playAudio(): void {
    if (this.isMusic) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isMusic = !this.isMusic;
  }

  modifyVolume(event: Event): void {
    this.audio.volume = parseFloat((event.target as HTMLInputElement).value);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.isMusic) {
      this.audio.pause();
    }
    this.audio.src = ''
  }
}
