import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Includes
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

// Interceptors
import { HeadersInterceptor } from "./helpers/interceptors/headers.interceptor";
import { ErrorsInterceptor } from './helpers/interceptors/errors.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Extra (icons)
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { SharedModule } from './modules/share.module';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, PaginationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // library.addIcons(faFilm, faFish, faBell, faAngular);
    library.addIconPacks(fas, far, fab);
  }
}
