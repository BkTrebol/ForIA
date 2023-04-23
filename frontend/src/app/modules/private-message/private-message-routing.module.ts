import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { CreateComponent } from './components/create/create.component';
import { ReplyComponent } from './components/reply/reply.component';

const routes: Routes = [
  { path: '', component: ListComponent, title: 'ForIA - Private Messages' },
  { path: 'new', component: CreateComponent, title: 'ForIA - New Message' },
  { path: 'reply/:id', component: ReplyComponent, title: 'ForIA - Reply' },
  { path: ':id', component: ViewComponent, title: 'ForIA - Private Message' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateMessageRoutingModule {}
