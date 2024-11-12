import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Shaper, Drawer, GraphOperations } from 'grash';
import * as graphDataJson from '../../assets/dataset/miserables.json';

@Component({
  selector: 'app-graph-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graph-viewer.component.html',
  styleUrls: ['./graph-viewer.component.scss']
})
export class GraphViewerComponent implements AfterViewInit, OnChanges {
  @ViewChild('container') containerRef!: ElementRef;
  shaper!: any;
  graphData: any = (graphDataJson as any);

  @Input() graphNumber: number | undefined;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['graphNumber'] && this.containerRef) {
      this.loadGraph(changes['graphNumber'].currentValue);
    }
  }

  loadGraph(graphNumber: number) {
    if (this.shaper) {
      this.shaper.destroy();
    }
    const { nodes, edges } = Drawer.fromJSON(this.graphData);
    this.shaper = new Shaper(this.containerRef.nativeElement, nodes, edges);
    //this.changeBackgroundColor("white");
    switch(graphNumber) { 
      case 1: { 
        this.shaper.setAllEdgesColor("yellow");
        break; 
      } 
      case 2: { 
        this.shaper.setAllEdgesColor("green");
        break; 
      }
      case 3: { 
        this.addLight(0,0,-8);
        this.shaper.setAllEdgesColor("yellow");
        this.autoRotateCamera();
        break; 
      } 
      case 4: { 
        this.changeBackgroundColor("white");
        this.showTablet();
        this.shaper.setCameraPosition(0, -100, 20);
        this.shaper.setAllNodesColor("red");
        this.shaper.setAllEdgesColor("black");
        this.shaper.interactions.disableMouseRotation();
        break; 
      } 
      case 5: { 
        this.shaper.setAllEdgesColor("yellow");
        break; 
      }
      case 6: { 
        this.changeBackgroundColor("white");
        this.showTablet();
        this.shaper.setCameraPosition(0, -50, 50);
        this.shaper.setAllEdgesColor("black");
        this.shaper.interactions.disableMouseRotation();
        this.shaper.interactions.disableShowNodePopUp();
        this.addAmbientLight();
        //this.shaper.interactions.enableRotationAroundTest();
        break; 
      } 
      default: { 
        break; 
      } 
   } 
  }

  constructor() { }

  ngAfterViewInit(): void {
    if (this.graphNumber !== undefined) {
      this.loadGraph(this.graphNumber);
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

  autoRotateCameraAroundZ() {
    this.shaper.autoRotateCameraAroundZ();
  }

  autoRotateCamera3() {
    this.shaper.autoRotateCameraAroundX();
  }

  stopRotateCamera() {
    this.shaper.stopRotateCamera();
  }

  showTablet() {
    this.shaper.showTablet();
  }

  hideTablet() {
    this.shaper.hideTablet();
  }

  showShadows() {
    this.shaper.enableShadows();
  }

  hideShadows() {
    this.shaper.disableShadows();
  }

  addLight(x: number, y: number, z: number) {
    this.shaper.addLight(x,y,z);
  }

  removeSelectedNodes() {
    this.shaper.removeSelectedNodes();
  }

  updateSimulation() {
    this.shaper.updateGraphSimulation();
  }

  addNode() {
    this.shaper.addNode();
  }

  addEdge() {
    const sourceNode = this.shaper.interactions.selectedNodes[0];
    const targetNode = this.shaper.interactions.selectedNodes[1];
    this.shaper.addEdge(sourceNode, targetNode);
  }

  extrudeSelectedNodes() {
    this.shaper.extrudeSelectedNodes();
  }

  doExtrusion() {
    this.shaper.doExtrusion();
  }

  resetExtrusion() {
    this.shaper.resetExtrusion();
  }

  changeCameraSettings() {
    this.shaper.setCameraSettings({
      fov: 10,
      aspect: 16/9,
      near: 0.1,
      far: 2000,
      distance: 500
    });
  }

  resetCameraSettings() {
    this.shaper.resetCameraSettings();
  }

  addAmbientLight() {
    this.shaper.addAmbientLight();
  }

  removeAmbientLight() {
    this.shaper.removeAmbientLight();
  }

  addHemisphereLight() {
    this.shaper.addHemisphereLight();
  }

  removeHemisphereLight() {
    this.shaper.removeHemisphereLight();
  }

  addDirLight() {
    this.shaper.addLight(0,10,15);
  }

  removeDirLight() {
    this.shaper.removeDirectionalLight();
  }

  extrudeShortestPath() {
    this.shaper.extrudeShortestPath();
  }

  resetShortestPathExtrusion() {
    this.shaper.resetShortestPathExtrusion();
  }

  extrudeNodesByGroup() {
    this.shaper.extrudeNodesByGroup();
  }

  resetNodesExtrusionByGroup() {
    this.shaper.resetNodesExtrusionByGroup();
  }

  colorNodesByGroup() {
    this.shaper.colorNodesByGroup();
  }

  resetNodesColors() {
    this.shaper.resetNodesColors();
  }
}
