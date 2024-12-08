import dagre from 'dagre';

export class LayoutService {
  computeLayout(nodes, edges) {
    const g = new dagre.graphlib.Graph();

    g.setGraph({
      rankdir: 'LR',
      align: 'UL',
      ranksep: 80,
      nodesep: 50,
      edgesep: 30,
      marginx: 20,
      marginy: 20
    });

    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes
    nodes.forEach(node => {
      g.setNode(node.id, {
        width: 150,
        height: 60,
        ...node
      });
    });

    // Add edges
    edges.forEach(edge => {
      g.setEdge(edge.from, edge.to);
    });

    dagre.layout(g);

    // Convert the layout back to our format
    const layout = {
      nodes: nodes.map(node => {
        const nodeWithPosition = g.node(node.id);
        return {
          ...node,
          x: nodeWithPosition.x,
          y: nodeWithPosition.y,
          width: nodeWithPosition.width,
          height: nodeWithPosition.height
        };
      }),
      edges: edges
    };

    return layout;
  }
}