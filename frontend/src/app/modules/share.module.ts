import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

// Extra (icons)
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AvatarUrlPipe } from '../helpers/pipes/avatar-url.pipe';

@NgModule({
  declarations: [AvatarUrlPipe],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    FontAwesomeModule,
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
  ],
})
export class SharedModule {}