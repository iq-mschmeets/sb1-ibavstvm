import Diagram from 'diagram-js';
import { assign } from 'min-dash';

// Import required diagram-js modules
import ConnectModule from 'diagram-js/lib/features/connect';
import ContextPadModule from 'diagram-js/lib/features/context-pad';
import CreateModule from 'diagram-js/lib/features/create';
import ModelingModule from 'diagram-js/lib/features/modeling';
import MoveModule from 'diagram-js/lib/features/move';
import OutlineModule from 'diagram-js/lib/features/outline';
import SelectionModule from 'diagram-js/lib/features/selection';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

export class DiagramService {
  constructor(container) {
    this.diagram = new Diagram({
      container,
      width: '100%',
      height: '800px',
      modules: [
        ConnectModule,
        ContextPadModule,
        CreateModule,
        ModelingModule,
        MoveModule,
        OutlineModule,
        SelectionModule,
        ZoomScrollModule
      ]
    });

    this.elementFactory = this.diagram.get('elementFactory');
    this.elementRegistry = this.diagram.get('elementRegistry');
    this.canvas = this.diagram.get('canvas');
    this.modeling = this.diagram.get('modeling');
  }

  calculateWaypoints(sourceShape, targetShape) {
    const sourceX = sourceShape.x + sourceShape.width;
    const sourceY = sourceShape.y + sourceShape.height / 2;
    const targetX = targetShape.x;
    const targetY = targetShape.y + targetShape.height / 2;

    return [
      { x: sourceX, y: sourceY },
      { x: targetX, y: targetY }
    ];
  }

  render(layout) {
    const rootElement = this.canvas.getRootElement();

    // Clear existing elements
    this.elementRegistry.getAll().forEach(element => {
      if (element !== rootElement) {
        this.modeling.removeElement(element);
      }
    });

    // Create nodes
    const nodeElements = layout.nodes.map(node => {
      const shape = this.elementFactory.createShape({
        id: node.id,
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        businessObject: assign({}, node)
      });

      this.canvas.addShape(shape, rootElement);
      return shape;
    });

    // Create edges
    layout.edges.forEach(edge => {
      const sourceShape = this.elementRegistry.get(edge.from);
      const targetShape = this.elementRegistry.get(edge.to);

      const waypoints = this.calculateWaypoints(sourceShape, targetShape);

      const connection = this.elementFactory.createConnection({
        id: edge.id,
        source: sourceShape,
        target: targetShape,
        waypoints: waypoints,
        businessObject: assign({}, edge)
      });

      this.canvas.addConnection(connection, rootElement);
    });

    this.canvas.zoom('fit-viewport');
  }
}