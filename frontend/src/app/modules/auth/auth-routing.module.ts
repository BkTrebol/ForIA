import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    title: 'ForIA - Register',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'ForIA - Login',
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'ForIA - Reset Password',
  },
  {
    path: '',
    redirectTo: '/error',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
