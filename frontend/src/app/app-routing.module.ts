import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards Can Load
import { AuthGuard } from './helpers/guards/canLoad/auth.guard';
import { GuestGuard } from './helpers/guards/canLoad/guest.guard';

// Lazy loading
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canLoad: [GuestGuard],
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'private-message',
    loadChildren: () =>
      import('./modules/private-message/private-message.module').then(
        (m) => m.PrivateMessageModule
      ),
    canLoad: [AuthGuard],
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
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/category/category.module').then(
        (m) => m.CategoryModule
      ),
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' }, // TODO: Error Page.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
