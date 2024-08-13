import { Component, EventEmitter, Output } from '@angular/core';
import { Coordinates, LONGMONT_CO_LOC, ORLANDO_FL_LOC, QUEZON_PH_LOC } from '../../util/location.util';

@Component({
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {
  @Output() handleViewOnMap: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  viewHomeOnMap() {
    this.handleViewOnMap.emit(LONGMONT_CO_LOC);
  }

  viewEducationOnMap() {
    this.handleViewOnMap.emit(ORLANDO_FL_LOC);
  }

  viewBirthplaceOnMap() {
    this.handleViewOnMap.emit(QUEZON_PH_LOC);
  }
}
