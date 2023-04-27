import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgbModule, NgbToast, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainer } from '../components/toast/toast.component';

// Extra (icons)
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Pipes
import {
  AvatarUrlPipe,
} from '../helpers/pipes/avatar-url.pipe';
import { TimeAgoPipe } from '../helpers/pipes/dates.pipe';
import { CapitalizePipe } from '../helpers/pipes/text.pipe';
import { SanitizerPipe } from '../helpers/pipes/sanitizer.pipe';

// Components
import { AvatarComponent } from '../components/avatar/avatar.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { LoadingComponent } from '../components/loading/loading.component';

//test charts
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    AvatarUrlPipe,
    TimeAgoPipe,
    CapitalizePipe,
    AvatarComponent,
    PaginationComponent,
    LoadingComponent,
    SanitizerPipe,
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
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
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
    CapitalizePipe,
    AvatarComponent,
    PaginationComponent,
    LoadingComponent,
    NgSelectModule,
    ToastsContainer,
    SanitizerPipe,
    NgxEchartsModule,
  ],
})
export class SharedModule {}
