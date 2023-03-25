import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { EditComponent } from './components/edit/edit.component';
import { PreferencesComponent } from './components/preferences/preferences.component';

const routes: Routes = [
  {path: 'profile', component: ProfileComponent,title:"User Profile"},
  {path: 'edit',component: EditComponent,title:"Edit Profile"},
  {path: 'preferences',component:PreferencesComponent,title:"Edit Preferences"},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
