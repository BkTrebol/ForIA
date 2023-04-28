import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComponent } from './view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/modules/share.module';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FontAwesomeTestingModule,
        RouterTestingModule,
        SharedModule,
      ],
      declarations: [ViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
