import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Shaper, Drawer, GraphOperations } from 'grash';

@Component({
  selector: 'app-graph-viewer',
  standalone: true,
  imports: [],
  templateUrl: './graph-viewer.component.html',
  styleUrl: './graph-viewer.component.scss'
})
export class GraphViewerComponent implements AfterViewInit {
  @ViewChild('container') containerRef!: ElementRef;
  shaper!: any;

  constructor() { }

  ngAfterViewInit(): void {
    if (this.containerRef && this.containerRef.nativeElement) {
      const graphData = {
        nodes: [
          { id: 1, x: 0, y: 0, z: 0 },
          { id: 2, x: 1, y: 1, z: 1, color: 'White' },
          { id: 3, x: 1, y: 2, z: 0 },
          { id: 4, x: 2, y: 1, z: 1 },
          { id: 5, x: 1.5, y: 1.5, z: 1.5,  color: 'Violet' },
          { id: 6, x: 1.8, y: 2.5, z: 1.2,  color: 'Yellow' },
          { id: 7, x: 1, y: -1, z: 2,  color: 'Green' },
          { id: 8, x: -1, y: -1, z: 2,  color: 'Green' },
          { id: 9, x: 1, y: -1, z: -2,  color: 'Green' },
          { id: 10, x: -1, y: -1, z: -2,  color: 'Green' },
        ],
        edges: [
          { node1: 1, node2: 2 },
          { node1: 2, node2: 3 },
          { node1: 2, node2: 4 },
          { node1: 4, node2: 5 },
          { node1: 3, node2: 6 },
          { node1: 1, node2: 7 },
          { node1: 1, node2: 8 },
          { node1: 1, node2: 9 },
          { node1: 1, node2: 10 },
        ]
      };

      const { nodes, edges } = Drawer.fromJSON(graphData);
      this.shaper = new Shaper(this.containerRef.nativeElement, nodes, edges);
      //this.changeBackgroundColor("white");
    }
  }

  onUploadFile(event: any) {
    //TODO
  }

  highlightNode() {
    GraphOperations.highlightNode(this.shaper.nodes, 1, 'red');
  }

  onSee2D() {
    this.shaper.see2D();
  }

  onSee3D() {
    this.shaper.see3D();
  }

  changeBackgroundColor(color: string) {
    this.shaper.setBackgroundColor(color);
  }

  resetBackgroundColor() {
    this.shaper.resetBackgroundColor();
  }

  autoRotateCamera() {
    this.shaper.autoRotateCamera();
  }

  stopRotateCamera() {
    this.shaper.stopRotateCamera();
  }
}
