import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopMouseComponent } from './desktop-mouse.component';

describe('DesktopMouseComponent', () => {
  let component: DesktopMouseComponent;
  let fixture: ComponentFixture<DesktopMouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopMouseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopMouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});