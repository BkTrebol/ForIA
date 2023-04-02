import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { EditComponent } from './components/edit/edit.component';
import { PreferencesComponent } from './components/preferences/preferences.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'ForIA - User Profile',
  },
  {
    path: 'profile',
    component: ProfileComponent, //change
    title: 'ForIA - User Preferences',
  },
  { path: 'edit', component: EditComponent, title: 'ForIA - Edit Profile' },
  {
    path: 'preferences',
    component: PreferencesComponent,
    title: 'ForIA - Edit Preferences',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
