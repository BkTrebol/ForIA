import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  {
    path: 'admin/login', loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin', children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'categories',
        loadChildren: () =>
          import('./modules/category/category.module').then(
            (m) => m.CategoryModule
          ),
        // canLoad: [CheckGuard],
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        // canLoad: [CheckGuard],
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/user/user.module').then(
            (m) => m.UserModule
          ),
        // canLoad: [CheckGuard],
      },]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
