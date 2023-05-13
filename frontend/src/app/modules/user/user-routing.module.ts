import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { EditComponent } from './components/edit/edit.component';

import { EditProfileResolver } from 'src/app/helpers/resolvers/edit-profile.resolver';
import { ShowProfileResolver } from 'src/app/helpers/resolvers/show-profile.resolver';
import { AuthGuard } from 'src/app/helpers/guards/canActivate/auth.guard';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
  {
    path: 'profile/:id',
    component: ProfileComponent,
    title: 'ForIA - User Profile',
    // resolve: {
    //   response: ShowProfileResolver,
    // },
  },
  {
    path: 'edit',
    component: EditComponent,
    title: 'ForIA - Edit Profile',
    // resolve: {
    //   response: EditProfileResolver,
    // },
    canActivate: [AuthGuard],
  },
  {
    path:'password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
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
  providers: [EditProfileResolver, ShowProfileResolver],
})
export class UserRoutingModule {}
