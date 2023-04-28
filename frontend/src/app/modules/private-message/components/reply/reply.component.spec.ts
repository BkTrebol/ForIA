import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyComponent } from './reply.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/share.module';

describe('ReplyComponent', () => {
  let component: ReplyComponent;
  let fixture: ComponentFixture<ReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FontAwesomeTestingModule,
        AngularEditorModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
      ],
      declarations: [ReplyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
