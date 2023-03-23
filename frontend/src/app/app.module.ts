import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

//App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
// Auth
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
// User
import { ProfileComponent } from './components/user/profile/profile.component';
import { EditComponent } from './components/user/edit/edit.component';
import { PreferencesComponent } from './components/user/preferences/preferences.component';
// Cateogry
import { ViewComponent } from './components/category/view/view.component';
import { ListComponent } from './components/category/list/list.component';
// Topic
import { CreateComponent } from './components/topic/create/create.component';
// Post
import { EditorComponent } from './components/post/editor/editor.component';
// Private message
import { ReplyComponent } from './components/private-message/reply/reply.component';
// Includes
import { HeaderComponent } from './components/includes/header/header.component';
import { FooterComponent } from './components/includes/footer/footer.component';

//Extra (icons)
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ProfileComponent,
    EditComponent,
    PreferencesComponent,
    ViewComponent,
    ListComponent,
    CreateComponent,
    EditorComponent,
    ReplyComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    FontAwesomeModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // library.addIcons(faFilm, faFish, faBell, faAngular);
    library.addIconPacks(fas, far, fab);
  }
}
