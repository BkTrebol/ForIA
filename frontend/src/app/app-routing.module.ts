import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guard
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AuthRoutingModule } from './modules/auth/auth-routing.module';
import { UserRoutingModule } from './modules/user/user-routing.module';
import { CategoryRoutingModule } from './modules/category/category-routing.module';

// Components
// import { RegisterComponent } from './components/auth/register/register.component';
// import { LoginComponent } from './components/auth/login/login.component';
// import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
// import { ProfileComponent } from './components/user/profile/profile.component';
// import { EditComponent } from './components/user/edit/edit.component';
// import { PreferencesComponent } from './components/user/preferences/preferences.component';
// import { ListComponent } from './components/category/list/list.component';

const routes: Routes = [
  {path: 'auth', loadChildren: () => AuthRoutingModule},
  {path: 'user', loadChildren: () => UserRoutingModule,canActivate:[AuthGuard]},
  {path: '', loadChildren: () => CategoryRoutingModule},
  {path: '**',redirectTo: '/', pathMatch: 'full'} // TODO: Error Page.
]
  // { path: 'auth/register', component: RegisterComponent, title: 'Register' },
  // { path: 'auth/login', component: LoginComponent, title: 'Login' },
  // {
  //   path: 'auth/reset-password',
  //   component: ResetPasswordComponent,
  //   title: 'Reset Password',
  // },

  // {
  //   path: 'user/profile',
  //   component: ProfileComponent,
  //   title: 'User Profile',
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'user/edit',
  //   component: EditComponent,
  //   title: 'Edit Profile',
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'user/preferences',
  //   component: PreferencesComponent,
  //   title: 'Edit Preferences',
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'user/preferences',
  //   component: PreferencesComponent,
  //   title: 'Edit Preferences',
  //   canActivate: [AuthGuard, RoleGuard],
  // },

//   {
//     path: '',
//     component: ListComponent,
//     title: 'ForIA',
//   },
//   { path: '**', redirectTo: '/', pathMatch: 'full' },
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, RoleGuard],
})
export class AppRoutingModule {}
