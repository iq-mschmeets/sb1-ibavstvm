import { LayoutService } from './services/LayoutService';
import { DiagramService } from './services/DiagramService';

export class DiagramEditor {
  constructor(container) {
    this.layoutService = new LayoutService();
    this.diagramService = new DiagramService(container);
  }

  render(nodes, edges) {
    const layout = this.layoutService.computeLayout(nodes, edges);
    this.diagramService.render(layout);
  }
}