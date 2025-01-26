import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Shaper, Drawer, GraphOperations } from 'grash';
import * as graphDataJson from '../../assets/dataset/miserables.json';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { ExtrudeGroupModalComponent } from '../extrude-group-modal/extrude-group-modal.component';
import { ResetGroupExtrusionModalComponent } from '../reset-group-extrusion-modal/reset-group-extrusion-modal.component';
import { SearchNodeModalComponent } from '../search-node-modal/search-node-modal.component';

@Component({
  selector: 'app-graph-viewer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatTooltipModule, MatDividerModule],
  templateUrl: './graph-viewer.component.html',
  styleUrls: ['./graph-viewer.component.scss']
})
export class GraphViewerComponent implements AfterViewInit, OnChanges {
  @ViewChild('container') containerRef!: ElementRef;
  shaper!: any;
  graphData: any = (graphDataJson as any);
  selectedNodeObj: any = null;
  selectionSubscription: Subscription | undefined;
  selectedMode: string = 'explore';
  isAutoRotateCamera: boolean = false;
  isShortestPathExtrusion: boolean = false;
  isAllByGroupsExtrusion: boolean = false;
  isAllNodesColoredByGroup: boolean = false;
  isAllEdgesColoredByGroup: boolean = false;
  isTabletVisible: boolean = true;

  @Input() graphNumber: number | undefined;

  constructor(
    private dialog: MatDialog
  ) {}
  //private snackBar: MatSnackBar

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
        this.shaper.setAllEdgesOriginalColor("yellow");
        break; 
      } 
      case 2: { 
        this.shaper.setAllEdgesOriginalColor("green");
        break; 
      }
      case 3: { 
        this.addLight(0,0,-8);
        this.shaper.setAllEdgesOriginalColor("yellow");
        this.autoRotateCamera();
        break; 
      } 
      case 4: { 
        this.changeBackgroundColor("white");
        this.showTablet();
        this.shaper.setCameraPosition(0, -100, 20);
        this.shaper.setAllNodesColor("red");
        this.shaper.setAllEdgesOriginalColor("black");
        this.shaper.interactions.disableMouseRotation();
        break; 
      } 
      case 5: { 
        this.shaper.setAllEdgesOriginalColor("yellow");
        break; 
      }
      case 6: { 
        this.changeBackgroundColor("white");
        this.showTablet();
        this.shaper.setCameraPosition(0, -50, 50);
        this.shaper.setAllEdgesOriginalColor("black");
        this.shaper.interactions.disableMouseRotation();
        this.shaper.interactions.disableShowNodePopUp();
        this.addAmbientLight();
        //this.shaper.interactions.enableRotationAroundTest();
        break; 
      } 
      case 7: { 
        this.changeBackgroundColor("white");
        this.showTablet();
        this.shaper.setAllEdgesOriginalColor("black");
        this.shaper.interactions.disableMouseRotation();
        //this.shaper.interactions.disableShowNodePopUp();
        this.addAmbientLight();
        this.changeCameraSettings();
        break; 
      } 
      case 8: { 
        this.changeBackgroundColor("white");
        this.showTablet();
        this.shaper.setAllEdgesOriginalColor("black");
        this.shaper.interactions.disableMouseRotation();
        //this.shaper.interactions.disableShowNodePopUp();
        this.addAmbientLight();
        this.changeCameraSettings();
        break; 
      } 
      default: { 
        break; 
      } 
   } 
  }

  ngAfterViewInit(): void {
    if (this.graphNumber !== undefined) {
      this.loadGraph(this.graphNumber);
      //this.subscribeOnSelectedNodeObj();
    }
  }

  selectMode(mode: string) {
    this.selectedMode = mode;
    switch(mode) {
      case 'explore': {
        this.shaper.interactions.enableExploreMode();
        break;
      }
      case 'edit': {
        this.shaper.interactions.enableEditMode();
        break;
      }
      case 'analytics': {
        this.shaper.interactions.enableAnalyticsMode();
        break;
      }
      default: {
        this.shaper.interactions.enableExploreMode();
        break;
      }
    }
  }

  isLensModeEnabled() {
    return this.shaper.interactions.lensEnabled;
  }

  subscribeOnSelectedNodeObj() {
    this.selectionSubscription = this.shaper.interactions.selectionChange$.subscribe((selectedNodes: any[]) => {
      if (selectedNodes.length === 1) {
        const selectedNode = selectedNodes[0];
        this.selectedNodeObj = {
          id: selectedNode.id,
          x: selectedNode.mesh.position.x,
          y: selectedNode.mesh.position.y,
          z: selectedNode.mesh.position.z,
          group: selectedNode.group
        };
      } else {
        this.selectedNodeObj = null;
      }
    });
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
    this.isAutoRotateCamera = true;
  }

  autoRotateCamera3() {
    this.shaper.autoRotateCameraAroundX();
  }

  stopRotateCamera() {
    this.shaper.stopRotateCamera();
    this.isAutoRotateCamera = false;
  }

  showTablet() {
    this.shaper.showTablet();
    this.isTabletVisible = true;
  }

  hideTablet() {
    this.shaper.hideTablet();
    this.isTabletVisible = false;
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
    this.isShortestPathExtrusion = true;
  }

  resetShortestPathExtrusion() {
    this.shaper.resetShortestPathExtrusion();
    this.isShortestPathExtrusion = false;
  }

  extrudeNodesByGroup() {
    this.shaper.extrudeNodesByGroup();
  }

  resetNodesExtrusionByGroup() {
    this.shaper.resetNodesExtrusionByGroup();
  }

  extrudeAllByGroups() {
    this.shaper.extrudeAllByGroups();
    this.isAllByGroupsExtrusion = true;
  }

  resetAllExtrusionByGroups() {
    this.shaper.resetAllExtrusionByGroups();
    this.isAllByGroupsExtrusion = false;
  }

  colorAllNodesByGroups() {
    this.shaper.colorAllNodesByGroups();
    this.isAllNodesColoredByGroup = true;
  }

  resetAllNodesColors() {
    this.shaper.resetAllNodesColors();
    this.isAllNodesColoredByGroup = false;
  }

  colorAllEdgesByGroups() {
    this.shaper.colorAllEdgesByGroups();
    this.isAllEdgesColoredByGroup = true;
  }

  resetAllEdgesColors() {
    this.shaper.resetAllEdgesColors();
    this.isAllEdgesColoredByGroup = false;
  }

  showNodeInfo() {
    const lastNode = this.shaper.interactions.selectedNodes.length-1;
    this.selectedNodeObj = this.shaper.interactions.selectedNodes[lastNode];
  }

  hideNodeInfo() {
    this.selectedNodeObj = null;
  }

  openSearchNodeDialog() {
    const dialogRef = this.dialog.open(SearchNodeModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.nodeId) {
        this.searchNode(result.nodeId);
      }
    });
  }

  extrudeAGroup() {
    const dialogRef = this.dialog.open(ExtrudeGroupModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { group, color, height } = result;
        this.shaper.extrudeByGroup(group, height, color);
      }
    });
  }

  resetGroupExtrusion() {
    const dialogRef = this.dialog.open(ResetGroupExtrusionModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { group } = result;
        this.shaper.resetExtrusionByGroup(group);
      }
    });
  }

  enableLensMode() {
    this.shaper.enableLensMode(100);
  }

  disableLensMode() {
    this.shaper.disableLensMode();
  }

  resetSelectedElements() {
    this.shaper.resetSelectedElements();
  }

  searchNode(nodeId: string) {
    this.shaper.interactions.searchAndSelectNodeById(nodeId);
  }

}
