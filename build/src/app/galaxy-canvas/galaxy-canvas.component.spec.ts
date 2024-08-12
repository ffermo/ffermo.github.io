import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalaxyCanvasComponent } from './galaxy-canvas.component';

describe('GalaxyCanvasComponent', () => {
  let component: GalaxyCanvasComponent;
  let fixture: ComponentFixture<GalaxyCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalaxyCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalaxyCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
