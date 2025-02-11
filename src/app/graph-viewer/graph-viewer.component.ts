import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, OnInit, OnDestroy } from '@angular/core';
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
import { ModeService } from '../services/mode.service';

@Component({
  selector: 'app-graph-viewer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatTooltipModule, MatDividerModule],
  templateUrl: './graph-viewer.component.html',
  styleUrls: ['./graph-viewer.component.scss']
})

export class GraphViewerComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy {
  @ViewChild('container') containerRef!: ElementRef;
  shaper!: any;
  graphData: any = (graphDataJson as any);
  selectedNodeObj: any = null;
  selectionSubscription: Subscription | undefined;
  selectedMode: string = 'explore';
  isAutoRotateCamera: boolean = false;
  isShortestPathExtrusion: boolean = false;
  isAllByGroupsExtrusion: boolean = false;
  isAllByDegreeExtrusion: boolean = false;
  isAllByDistanceExtrusion: boolean = false;
  isAllNodesColoredByGroup: boolean = false;
  isAllEdgesColoredByGroup: boolean = false;
  isTabletVisible: boolean = true;
  private modeSubscription!: Subscription;

  @Input() graphNumber: number | undefined;

  constructor(
    private dialog: MatDialog,
    private modeService: ModeService
  ) {}

  ngOnInit() {
    this.modeSubscription = this.modeService.mode$.subscribe(({ mode, data }) => {
      if (mode === '3D') {
        this.set3DCamera();
      } else if (mode === '2D') {
        this.set2DCamera();
      } else if (mode === 'autoRotateCameraAroundZ') {
        this.autoRotateCameraAroundZ();
      } else if (mode === 'stopRotateCameraAroundZ') {
        this.stopRotateCamera();
      } else if (mode === 'loadGraph') {
        this.loadGraphData(data);
        if (this.graphNumber !== undefined) {
          this.manageGraphView(this.graphNumber);
        } else {
          this.manageGraphView(0);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.graphNumber !== undefined) {
      this.loadGraphData(this.graphData);
      this.manageGraphView(this.graphNumber);
      //this.subscribeOnSelectedNodeObj();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['graphNumber'] && this.containerRef) {
      this.loadGraphData(this.graphData);
      this.manageGraphView(changes['graphNumber'].currentValue);
    }
  }

  loadGraphData(data: any) {
    if (this.shaper) {
      this.shaper.destroy();
    }
    if(data === null) {
      this.graphData = (graphDataJson as any);
    } else {
      this.graphData = data;
    }
    const { nodes, edges } = Drawer.fromJSON(data);
    this.shaper = new Shaper(this.containerRef.nativeElement, nodes, edges);
  }

  manageGraphView(graphNumber: number) {
    switch(graphNumber) {
      case 0: { 
        this.changeBackgroundColor("white");
        this.showTablet();
        this.shaper.setAllEdgesOriginalColor("black");
        this.shaper.interactions.disableMouseRotation();
        //this.shaper.interactions.disableShowNodePopUp();
        this.addAmbientLight();
        this.changeCameraSettings();
        break; 
      } 
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
      default: { 
        break; 
      } 
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
    return this.shaper?.interactions?.lensEnabled;
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

  removeSelectedEdges() {
    this.shaper.removeSelectedEdges();
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

  set2DCamera() {
    this.shaper.set2DCameraSettings(70);
  }

  set3DCamera() {
    this.shaper.setCameraSettings({
      fov: 10,
      aspect: 16/9,
      near: 0.1,
      far: 2000,
      distance: 300
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
    this.shaper?.enableLensMode(100);
  }

  disableLensMode() {
    this.shaper?.disableLensMode();
  }

  isNeighboursHighlightActive() {
    return this.shaper?.interactions?.flagNeighboursHighlight;
  }

  enableNeighboursHighlight() {
    this.shaper?.interactions.enableNeighboursHighlight();
  }
  
  disableNeighboursHighlight() {
    this.shaper?.interactions?.disableNeighboursHighlight();
  }

  isGroupNodesHighlightActive() {
    return this.shaper?.interactions?.flagGroupNodesHighlight;
  }

  enableGroupNodesHighlight() {
    this.shaper?.interactions?.enableGroupNodesHighlight();
  }
  
  disableGroupNodesHighlight() {
    this.shaper?.interactions?.disableGroupNodesHighlight();
  }

  resetSelectedElements() {
    this.shaper?.resetSelectedElements();
  }

  searchNode(nodeId: string) {
    this.shaper.interactions.searchAndSelectNodeById(nodeId);
  }

  extrudeAllByDegree() {
    this.shaper.extrudeAllNodesByDegree();
    this.isAllByDegreeExtrusion = true;
  }

  resetAllExtrusionByDegree() {
    this.shaper.resetAllNodesExtrusionByDegree();
    this.isAllByDegreeExtrusion = false;
  }

  extrudeAllByDistance() {
    this.shaper.extrudeNodesByDistance(1, 1.5, true, true);
    this.isAllByDistanceExtrusion = true;
  }

  resetAllExtrusionByDistance() {
    this.shaper.resetNodesExtrusionByDistance(1, 1.5, true);
    this.isAllByDistanceExtrusion = false;
  }

  ngOnDestroy() {
    this.modeSubscription.unsubscribe();
  }

}
