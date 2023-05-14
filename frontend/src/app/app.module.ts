import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


// Includes
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ErrorComponent } from './components/error/error.component';

// Interceptors
import { HeadersInterceptor } from "./helpers/interceptors/headers.interceptor";
import { ErrorsInterceptor } from './helpers/interceptors/errors.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

// Extra (icons)
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { SharedModule } from './modules/share.module';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainer } from './components/toast/toast.component';
import { AdminComponent } from './modules/admin/admin.component';
import { SidenavComponent } from './modules/admin/components/sidenav/sidenav.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ErrorComponent,
    AdminComponent,
    SidenavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    SharedModule,
    NgbModule,
    NgbToastModule,
    ToastsContainer,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http:HttpClient) =>  {return new TranslateHttpLoader(http, './assets/i18n/', '.json');},
        deps: [HttpClient]
      }
    })
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
  constructor(library: FaIconLibrary,private translate: TranslateService) {
    // library.addIcons(faFilm, faFish, faBell, faAngular);
    library.addIconPacks(fas, far, fab);
    translate.setDefaultLang('en');
  }
}
