import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { CreateComponent } from './components/create/create.component';
import { EditComponent } from './components/edit/edit.component';
import { EditorComponent } from './components/editor/editor.component';
import { SharedModule } from '../share.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [CreateComponent, EditComponent, EditorComponent],
  imports: [CommonModule, PostRoutingModule, SharedModule, AngularEditorModule],
})
export class PostModule {}
