import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopGalaxyCanvasComponent } from './desktop-galaxy-canvas.component';

describe('DesktopGalaxyCanvasComponent', () => {
  let component: DesktopGalaxyCanvasComponent;
  let fixture: ComponentFixture<DesktopGalaxyCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopGalaxyCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopGalaxyCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
