import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
// Auth
// import { LoginComponent } from './components/auth/login/login.component';
// import { RegisterComponent } from './components/auth/register/register.component';
// import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
// // User
// import { ProfileComponent } from './components/user/profile/profile.component';
// import { EditComponent } from './components/user/edit/edit.component';
// import { PreferencesComponent } from './components/user/preferences/preferences.component';
// // Cateogry
// import { ViewComponent } from './components/category/view/view.component';
// import { ListComponent } from './components/category/list/list.component';
// // Topic
// import { CreateComponent } from './components/topic/create/create.component';
// // Post
// import { EditorComponent } from './components/post/editor/editor.component';
// // Private message
// import { ReplyComponent } from './components/private-message/reply/reply.component';
// Includes
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

// Interceptors
import { HeadersInterceptor } from "./interceptors/headers.interceptor";
import { HTTP_INTERCEPTORS } from '@angular/common/http';

//Extra (icons)
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { SharedModule } from './modules/share.module';

import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { PostModule } from './modules/post/post.module';
import { PrivateMessageModule } from './modules/private-message/private-message.module';
import { TopicModule } from './modules/topic/topic.module';
import { UserModule } from './modules/user/user.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // SharedModule,
    FontAwesomeModule,
    AuthModule,
    CategoryModule,
    PostModule,
    PrivateMessageModule,
    TopicModule,
    UserModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // library.addIcons(faFilm, faFish, faBell, faAngular);
    library.addIconPacks(fas, far, fab);
  }
}
