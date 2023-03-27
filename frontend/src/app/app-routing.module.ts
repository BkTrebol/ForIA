import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './helpers/guards/auth.guard';
import { RoleGuard } from './helpers/guards/role.guard';
// TODO auth guard invers

// Lazy loading
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'private-message',
    loadChildren: () =>
      import('./modules/private-message/private-message.module').then(
        (m) => m.PrivateMessageModule
      ),
    canActivate: [AuthGuard],
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
  providers: [AuthGuard, RoleGuard],
})
export class AppRoutingModule {}
