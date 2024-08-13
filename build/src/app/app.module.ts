import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GalaxyCanvasComponent } from './galaxy-canvas/galaxy-canvas.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MobileGalaxyCanvasComponent } from './mobile-galaxy-canvas/mobile-galaxy-canvas.component';
import { DesktopMouseComponent } from './desktop-mouse/desktop-mouse.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    GalaxyCanvasComponent,
    MobileGalaxyCanvasComponent,
    DesktopMouseComponent,
    MenuBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
