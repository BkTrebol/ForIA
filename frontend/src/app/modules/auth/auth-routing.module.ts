import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent,title: 'Register'},
  {path: 'login', component: LoginComponent,title: 'Login'},
  {path: 'reset-password', component: ResetPasswordComponent,title: 'Reset Password'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
