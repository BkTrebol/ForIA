import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

// Extra (icons)
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Pipes
import { AvatarUrlPipe } from '../helpers/pipes/avatar-url.pipe';

// Components
import { AvatarComponent } from '../components/avatar/avatar.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AvatarUrlPipe, AvatarComponent, PaginationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    FontAwesomeModule,
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
    AvatarUrlPipe,
    AvatarComponent,
    PaginationComponent,
    NgSelectModule,
    RouterModule,
  ],
})
export class SharedModule {}
