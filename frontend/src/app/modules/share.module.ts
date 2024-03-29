import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Skeleton loader
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// Ngb modules
import {
  NgbTooltipModule, NgbCollapse,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';

// Extra (icons)
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Pipes
import {
  AvatarUrlPipe,
} from '../helpers/pipes/avatar-url.pipe';
import { TimeAgoPipe, FinshsedPipe } from '../helpers/pipes/dates.pipe';
import { CapitalizePipe, SecondsPipe } from '../helpers/pipes/text.pipe';
import { SanitizerPipe } from '../helpers/pipes/sanitizer.pipe';

// Components
import { AvatarComponent } from '../components/avatar/avatar.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { LoadingComponent } from '../components/loading/loading.component';
import { ToastsContainer } from '../components/toast/toast.component';

//Charts
import { NgxEchartsModule } from 'ngx-echarts';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

// Translate
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AvatarUrlPipe,
    TimeAgoPipe,
    FinshsedPipe,
    CapitalizePipe,
    SecondsPipe,
    AvatarComponent,
    PaginationComponent,
    LoadingComponent,
    SanitizerPipe,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    FontAwesomeModule,
    NgxSkeletonLoaderModule,
    NgSelectModule,
    ToastsContainer,
    NgbTooltipModule,
    NgbCollapse,
    NgbProgressbarModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    TranslateModule.forChild(),
  ],
  providers: [],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    FontAwesomeModule,
    NgxSkeletonLoaderModule,
    AvatarUrlPipe,
    TimeAgoPipe,
    FinshsedPipe,
    CapitalizePipe,
    SecondsPipe,
    AvatarComponent,
    PaginationComponent,
    LoadingComponent,
    NgSelectModule,
    ToastsContainer,
    SanitizerPipe,
    NgxEchartsModule,
    SidebarComponent,
    NgbTooltipModule,
    NgbCollapse,
    NgbProgressbarModule,
    TranslateModule,
  ],
})
export class SharedModule {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
  }
}
