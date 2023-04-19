import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectSkeComponent } from './rect-ske.component';

describe('RectSkeComponent', () => {
  let component: RectSkeComponent;
  let fixture: ComponentFixture<RectSkeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RectSkeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RectSkeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
