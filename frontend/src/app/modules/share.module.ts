import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

// Extra (icons)
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Pipes
import {
  AvatarUrlPipe,
  ToDatePipe,
  Short,
} from '../helpers/pipes/avatar-url.pipe';
import { NgPipesModule } from 'ngx-pipes';

// Directives
import { SkeletonDirective } from '../helpers/directives/skeleton.directive';

// Components
import { AvatarComponent } from '../components/avatar/avatar.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AvatarUrlPipe,
    ToDatePipe,
    Short,
    AvatarComponent,
    PaginationComponent,
    SkeletonDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    FontAwesomeModule,
    NgSelectModule,
    RouterModule,
    NgPipesModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
  ],
  providers: [],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    FontAwesomeModule,
    AvatarUrlPipe,
    ToDatePipe,
    Short,
    AvatarComponent,
    PaginationComponent,
    SkeletonDirective,
    NgSelectModule,
    RouterModule,
    NgPipesModule,
  ],
})
export class SharedModule {}
