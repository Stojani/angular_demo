declare module 'grash' {
    export class Graph {
      constructor(nodes: any[], edges: any[]);
    }
  
    export class Node {
      constructor(id: number, x?: number, y?: number, z?: number, color?: string);
      id: number;
      mesh: any;
    }
  
    export class Edge {
      constructor(node1: Node, node2: Node, material?: any);
      mesh: any;
      updateGeometry(): void;
    }
  
    export class Shaper {
      constructor(container: HTMLElement, nodes: Node[], edges: Edge[]);
      init(): void;
      see2D(): void;
      see3D(): void;
      animate(): void;
    }
  
    export class Drawer {
      static fromJSON(data: any): { nodes: Node[], edges: Edge[] };
    }
  
    export class GraphOperations {
      static highlightNode(nodes: Node[], id: number, color: string): void;
    }
  }