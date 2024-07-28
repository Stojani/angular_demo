import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output() graphSelected = new EventEmitter<number>();
  selectedGraph: number | undefined;

  selectGraph(graphNumber: number) {
    this.selectedGraph = graphNumber;
    this.graphSelected.emit(graphNumber);
  }

}
