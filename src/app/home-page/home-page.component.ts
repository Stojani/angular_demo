import { Component } from '@angular/core';
import { GraphViewerComponent } from '../graph-viewer/graph-viewer.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [GraphViewerComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
