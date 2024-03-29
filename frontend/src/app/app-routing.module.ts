import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards Can Load and Can Activate Child
import { AuthGuard } from './helpers/guards/canLoad/auth.guard';
import { GuestGuard } from './helpers/guards/canLoad/guest.guard';
import { AuthGuard as AuthChildGuard } from './helpers/guards/canActivateChild/auth.guard';
import { GuestGuard as GuestChildGuard } from './helpers/guards/canActivateChild/guest.guard';

import { ErrorComponent } from './components/error/error.component';

// Lazy loading
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canLoad: [GuestGuard],
    canActivateChild: [GuestChildGuard],
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'private-message',
    loadChildren: () =>
      import('./modules/private-message/private-message.module').then(
        (m) => m.PrivateMessageModule
      ),
    canLoad: [AuthGuard],
    canActivateChild: [AuthChildGuard],
  },
  {
    path: 'topic',
    loadChildren: () =>
      import('./modules/topic/topic.module').then((m) => m.TopicModule),
  },
  {
    path: 'post',
    loadChildren: () =>
      import('./modules/post/post.module').then((m) => m.PostModule),
    canLoad: [AuthGuard],
    canActivateChild: [AuthChildGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/category/category.module').then(
        (m) => m.CategoryModule
      ),
  },
  { path: 'error', component: ErrorComponent, title: 'ForIA - Error Page' },
  { path: '**', redirectTo: '/error', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, GuestGuard, AuthChildGuard, GuestChildGuard],
})
export class AppRoutingModule {}
