import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListComponent } from './list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FontAwesomeTestingModule,
        RouterTestingModule,
      ],
      declarations: [ListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
