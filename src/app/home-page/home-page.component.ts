import { Component } from '@angular/core';
import { GraphViewerComponent } from '../graph-viewer/graph-viewer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [GraphViewerComponent, NavbarComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  selectedGraph: number = 1;

  onGraphSelected(graphNumber: number) {
    this.selectedGraph = graphNumber;
  }

}
