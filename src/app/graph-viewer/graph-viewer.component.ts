import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Shaper, Drawer, GraphOperations } from 'grash';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-graph-viewer',
  standalone: true,
  imports: [],
  templateUrl: './graph-viewer.component.html',
  styleUrl: './graph-viewer.component.scss'
})
export class GraphViewerComponent implements AfterViewInit  {
  @ViewChild('container') containerRef!: ElementRef;
  shaper!: any;
  controls!: OrbitControls;

  constructor() { }

  ngAfterViewInit(): void {
    if (this.containerRef && this.containerRef.nativeElement) {
      const graphData = {
        nodes: [
          { id: 1, x: 0, y: 0, z: 0 },
          { id: 2, x: 1, y: 1, z: 1, color: 'White' },
          { id: 3, x: 1, y: 2, z: 0 },
          { id: 4, x: 2, y: 1, z: 1 }
        ],
        edges: [
          { node1: 1, node2: 2 },
          { node1: 2, node2: 3 },
          { node1: 2, node2: 4 }
        ]
      };

      const { nodes, edges } = Drawer.fromJSON(graphData);
      this.shaper = new Shaper(this.containerRef.nativeElement, nodes, edges);

      this.initOrbitControls();
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

  private initOrbitControls() {
    this.controls = new OrbitControls(this.shaper.camera, this.shaper.renderer.domElement);
    this.controls.enableDamping = true; // Movimento fluido
    this.controls.dampingFactor = 0.25; // Impostazione del fattore di smorzamento

    // Abilita il movimento della camera con il mouse
    this.controls.rotateSpeed = 0.3;
    this.controls.zoomSpeed = 0.9;
    this.controls.panSpeed = 0.8;

    // Limita gli angoli di inclinazione
    this.controls.minPolarAngle = Math.PI / 4; // Angolo minimo di inclinazione
    this.controls.maxPolarAngle = Math.PI - Math.PI / 4; // Angolo massimo di inclinazione

    // Limita lo zoom della camera
    this.controls.minDistance = 1; // Distanza minima
    this.controls.maxDistance = 100; // Distanza massima

    // Abilita il controllo dell'orbita
    this.controls.enablePan = true;
    this.controls.screenSpacePanning = true;

    // Aggiungi event listener per l'aggiornamento
    this.shaper.renderer.domElement.addEventListener('mousemove', () => this.controls.update());
    this.shaper.renderer.domElement.addEventListener('resize', () => this.onWindowResize());

    this.animate();
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.shaper.renderer.render(this.shaper.scene, this.shaper.camera);
  }

  private onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.shaper.setSize(width, height);
    this.controls.update();
  }
}
