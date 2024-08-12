import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MobileGalaxyCanvasComponent } from './mobile-galaxy-canvas/mobile-galaxy-canvas.component';
import { DesktopGalaxyCanvasComponent } from './desktop-galaxy-canvas/desktop-galaxy-canvas.component';
import { GalaxyCanvasComponent } from './galaxy-canvas/galaxy-canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    GalaxyCanvasComponent,
    MobileGalaxyCanvasComponent,
    DesktopGalaxyCanvasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
