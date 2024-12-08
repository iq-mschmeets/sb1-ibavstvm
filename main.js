import './style.css';
import { DiagramEditor } from './src/DiagramEditor';
import { nodes } from './src/data/nodes';
import { edges } from './src/data/edges';

document.querySelector('#app').innerHTML = `
  <div class="diagram-container"></div>
`;

const container = document.querySelector('.diagram-container');
const editor = new DiagramEditor(container);
editor.render(nodes, edges);