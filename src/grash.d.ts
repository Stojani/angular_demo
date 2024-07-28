declare module 'grash' {
  export class Shaper {
    constructor(container: HTMLElement, nodes: Node[], edges: Edge[]);
    static drawGraph(container: HTMLElement, data: { nodes: any[], edges: any[] }): void;

    // Metodi esistenti
    setSize(width: number, height: number): void;
    setZoom(zoom: number): void;
    setMaxZoomIn(maxZoomIn: number): void;
    setMaxZoomOut(maxZoomOut: number): void;
    see2D(): void;
    see3D(): void;
    setBackgroundColor(color: string): void;
    resetBackgroundColor(): void;
    rotateCamera(): void;
    autoRotateCamera(): void;
    stopRotateCamera(): void;
    showTablet(): void;
    hideTablet(): void;
    enableShadows(): void;
    disableShadows(): void;
    destroy(): void;

    // Metodi nuovi
    initForceSimulation(): void;
    ticked(): void;
    animate(): void;
  }

  export class Drawer {
    static fromJSON(jsonData: any): { nodes: Node[], edges: Edge[] };
    static fromFile(fileContent: string): { nodes: Node[], edges: Edge[] };
  }

  export class Node {
    constructor(id: number, x: number, y: number, z: number, color?: string, geometry?: any);
    id: number;
    x: number;
    y: number;
    z: number;
    color: string;
    geometry: any;
    mesh: any;
    initialZ: number;
  }

  export class Edge {
    constructor(source: Node, target: Node, material?: any);
    source: Node;
    target: Node;
    material: any;
    geometry: any;
    mesh: any;
    updateGeometry(): void;
  }

  export class Graph {
    constructor(nodes: Node[], edges: Edge[]);
  }

  export class GraphInteractions {
    constructor(camera: any, renderer: any);
    update(): void;
  }

  export class GraphOperations {
    static highlightNode(nodes: Node[], nodeId: number, color: string): void;
  }
}
