import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileGalaxyCanvasComponent } from './mobile-galaxy-canvas.component';

describe('MobileGalaxyCanvasComponent', () => {
  let component: MobileGalaxyCanvasComponent;
  let fixture: ComponentFixture<MobileGalaxyCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileGalaxyCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileGalaxyCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
