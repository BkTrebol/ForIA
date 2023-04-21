import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// Extra (icons)
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Pipes
import {
  AvatarUrlPipe,
} from '../helpers/pipes/avatar-url.pipe';
import { TimeAgoPipe } from '../helpers/pipes/dates.pipe';
import { CapitalizePipe } from '../helpers/pipes/text.pipe';

// Components
import { AvatarComponent } from '../components/avatar/avatar.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { LoadingComponent } from '../components/loading/loading.component';

@NgModule({
  declarations: [
    AvatarUrlPipe,
    TimeAgoPipe,
    CapitalizePipe,
    AvatarComponent,
    PaginationComponent,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    FontAwesomeModule,
    NgxSkeletonLoaderModule,
    NgSelectModule,
    RouterModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
  ],
  providers: [],
  exports: [
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
    RouterModule,
  ],
})
export class SharedModule {}
