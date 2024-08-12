import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-galaxy-canvas',
  templateUrl: './galaxy-canvas.component.html',
  styleUrls: ['./galaxy-canvas.component.scss']
})

export class GalaxyCanvasComponent {
  isDesktop: boolean;
  isMobile: boolean;

  constructor(private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
    this.isDesktop = this.deviceService.isDesktop();
  }
}
