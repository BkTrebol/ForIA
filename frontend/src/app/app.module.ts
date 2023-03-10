import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { EditComponent } from './components/user/edit/edit.component';
import { PreferencesComponent } from './components/user/preferences/preferences.component';
import { ViewComponent } from './components/category/view/view.component';
import { ListComponent } from './components/category/list/list.component';
import { CreateComponent } from './components/topic/create/create.component';
import { EditorComponent } from './components/post/editor/editor.component';
import { ReplyComponent } from './components/private-message/reply/reply.component';
import { HeaderComponent } from './components/includes/header/header.component';
import { FooterComponent } from './components/includes/footer/footer.component';

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
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
