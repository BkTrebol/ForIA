import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

// Extra (icons)
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AvatarUrlPipe } from '../helpers/pipes/avatar-url.pipe';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AvatarUrlPipe],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    FontAwesomeModule,
    NgSelectModule,
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
    NgSelectModule,
  ],
})
export class SharedModule {}