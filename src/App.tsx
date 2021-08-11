import React from 'react';
import Graph from './Components/Graph'
import { generateData } from './helpers/GenerateRandomData';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

interface NodeData {
  Type: string,
  History: string,
  'Mission Statement': string,
  Link: string,
  'How can I get Involved?': string
}

export interface NodeInfo {
  name: string,
  type: string,
  links: string[],
  data?: NodeData[]
}

// const nodes: NodeInfo[] = [
//   { name: 'DAML', type: 'Organizations', links: [] },
//   { name: 'Data+', type: 'Programs', links: [] },
//   { name: 'DUML', type: 'Organizations', links: [] },
//   { name: 'Dr. Professor', type: 'Faculty', links: ['Research'] },
//   { name: 'Research', type: 'Programs', links: [] },
//   { name: 'Math Department', type: 'Hubs', links: ['DUML', 'DAML'] },
//   { name: 'CS Department', type: 'Hubs', links: ['Data+'] },
//   { name: 'Stats Department', type: 'Hubs', links: ['Research'] },
//   { name: 'Humanities', type: 'Hubs', links: ['Data+'] },
// ];

const nodes: NodeInfo[] = generateData(60);

function App() {
  return (
    <Graph nodes = {nodes}/>
  );
}

export default App;
