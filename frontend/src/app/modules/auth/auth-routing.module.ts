import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { GuestGuard } from 'src/app/helpers/guards/canActivate/guest.guard';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    title: 'ForIA - Register',
    canActivate: [GuestGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'ForIA - Login',
    canActivate: [GuestGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'ForIA - Reset Password',
    canActivate: [GuestGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
