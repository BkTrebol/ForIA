import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { EditComponent } from './components/edit/edit.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { AuthGuard } from 'src/app/helpers/guards/canActivate/auth.guard';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'ForIA - User Profile',
    canActivate: [AuthGuard],
  },
  {
    path: 'preferences',
    component: ProfileComponent, //change
    title: 'ForIA - User Preferences',
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/profile',
    component: EditComponent,
    title: 'ForIA - Edit Profile',
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/preferences',
    component: PreferencesComponent,
    title: 'ForIA - Edit Preferences',
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
