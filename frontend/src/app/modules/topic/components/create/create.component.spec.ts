import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { SharedModule } from 'src/app/modules/share.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CreateComponent } from './create.component';
import { TranslateModule } from '@ngx-translate/core';

describe('CreateComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        AngularEditorModule,
        SharedModule,
        FontAwesomeTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [CreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
