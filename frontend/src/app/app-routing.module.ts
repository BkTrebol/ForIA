import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { EditComponent } from './components/user/edit/edit.component';
import { PreferencesComponent } from './components/user/preferences/preferences.component';
import { ListComponent } from './components/category/list/list.component';

const routes: Routes = [
  { path: 'auth/register', component: RegisterComponent, title: 'Register' },
  { path: 'auth/login', component: LoginComponent, title: 'Login' },

  { path: 'user/profile', component: ProfileComponent, title: 'User Profile' },
  { path: 'user/edit', component: EditComponent, title: 'Edit Profile' },
  { path: 'user/preferences', component: PreferencesComponent, title: 'Edit Preferences' },

  { path: 'user/edit', component: ListComponent, title: 'ForIA' },
  { path: '', redirectTo: '/', pathMatch: 'full'},
  { path: '**', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
