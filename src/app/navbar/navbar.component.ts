import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ModeService } from '../services/mode.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSlideToggleModule, FormsModule, MatTooltipModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() graphSelected = new EventEmitter<number>();
  selectedGraph: number = 0;
  is3DMode: boolean = true; // Modalità di default è 3D
  isAutoRotateCamera: boolean = false;

  constructor(private modeService: ModeService) {}

  selectGraph(graphNumber: number) {
    this.selectedGraph = graphNumber;
    this.graphSelected.emit(graphNumber);
  }

  toggleMode() {
    if (this.is3DMode) {
      this.switchTo3D();
    } else {
      this.switchTo2D();
    }
  }

  switchTo3D() {
    this.modeService.setMode('3D');
  }

  switchTo2D() {
    this.modeService.setMode('2D');
  }

  autoRotateCamera() {
    this.modeService.setMode('autoRotateCameraAroundZ');
    this.isAutoRotateCamera = true;
  }

  stopRotateCamera() {
    this.modeService.setMode('stopRotateCameraAroundZ');
    this.isAutoRotateCamera = false;
  }
}
