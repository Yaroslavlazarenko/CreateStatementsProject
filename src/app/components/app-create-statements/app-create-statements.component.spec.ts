import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCreateStatementsComponent } from './app-create-statements.component';

describe('AppCreateStatementsComponent', () => {
  let component: AppCreateStatementsComponent;
  let fixture: ComponentFixture<AppCreateStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppCreateStatementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCreateStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
