import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guard
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

// Components
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { EditComponent } from './components/user/edit/edit.component';
import { PreferencesComponent } from './components/user/preferences/preferences.component';
import { ListComponent } from './components/category/list/list.component';

const routes: Routes = [
  { path: 'auth/register', component: RegisterComponent, title: 'Register' },
  { path: 'auth/login', component: LoginComponent, title: 'Login' },
  {
    path: 'auth/reset-password',
    component: ResetPasswordComponent,
    title: 'Reset Password',
  },

  {
    path: 'user/profile',
    component: ProfileComponent,
    title: 'User Profile',
    canActivate: [authGuard],
  },
  {
    path: 'user/edit',
    component: EditComponent,
    title: 'Edit Profile',
    canActivate: [authGuard],
  },
  {
    path: 'user/preferences',
    component: PreferencesComponent,
    title: 'Edit Preferences',
    canActivate: [authGuard],
  },
  // {
  //   path: 'user/preferences',
  //   component: PreferencesComponent,
  //   title: 'Edit Preferences',
  //   canActivate: [authGuard, roleGuard],
  // },

  {
    path: '',
    component: ListComponent,
    title: 'ForIA',
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
