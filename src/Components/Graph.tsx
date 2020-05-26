import createEngine, { DiagramModel, DefaultLinkModel } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import styled from '@emotion/styled';
import './main.css'
import { Checkbox, Button } from 'semantic-ui-react';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget'
import { CircleNodeFactory } from './CircleNode/CircleNodeFactory';
import { CircleNodeModel } from './CircleNode/CircleNodeModel';
import { CustomLabelFactory } from './CustomLabel/CustomLabelFactory';
import { RectangleNodeFactory } from './RectangleNode/RectangleNodeFactory';
import { RectangleNodeModel } from './RectangleNode/RectangleNodeModel';
import { ZoomCanvasAction } from '@projectstorm/react-canvas-core';
import { CustomLinkModel } from './CustomLink/CustomLinkModel';
import { CustomLinkFactory } from './CustomLink/CustomLinkFactory';
import 'semantic-ui-css/semantic.min.css';

const linkcolors = {
	'Organizations::Faculty': '#000000',
	'Organizations::Programs': '#000000',
	'Organizations::Hubs': '#000000',
	'Faculty::Programs': '#000000',
	'Faculty::Hubs': '#FFFFFF',
	'Programs::Hubs': '#FFFFFF'
}

const types = [
	'Organizations',
	'Faculty',
	'Programs',
	'Hubs'
]

let allnodes = [];
let nodes = {
	'Organizations': [],
	'Programs': [],
	'Faculty': [],
	'Hubs': [],
}

let alllinks = [];
let links = {
	'Organizations': [],
	'Programs': [],
	'Faculty': [],
	'Hubs': [],
}

class Graph extends React.Component {
	state = {
		engine: null,
	}

	// Get Link Color
	getColor(t1, t2) {
		let names = [t1+'::'+t2, t2+'::'+t1];
		const keys = Object.keys(linkcolors);
		if(keys.includes(names[0])) {
			return linkcolors[names[0]];
		}
		else if(keys.includes(names[1])) {
			return linkcolors[names[1]];
		}
		return '#FFFFFF';
	}

	componentWillMount() {
		const ret = [
			{name: 'DAML', type: 'Organizations', links: []},
			{name: 'Data+', type: 'Programs', links: []},
			{name: 'DUML', type: 'Organizations', links: []},
			{name: 'Dr. Professor', type: 'Faculty', links: ['Research']},
			{name: 'Research', type: 'Programs', links: []},
			{name: 'Math Department', type: 'Hubs', links: ['DUML', 'DAML']},
			{name: 'CS Department', type: 'Hubs', links: ['Data+']},
			{name: 'Stats Department', type: 'Hubs', links: ['Research']},
			{name: 'Humanities', type: 'Hubs', links: ['Data+']},
		];

		// For Circle Layout
		const points = ret.length;
		let allpos = [];
		const rad = 150*ret.length/(2*Math.PI);
		for(var a = 3*Math.PI; a > Math.PI; a-=(2*Math.PI/ret.length)) {
			allpos.push([Math.cos(a) * rad, Math.sin(a) * rad]);
		}
		
		//For Grid Layout
		const pos = {
			'Hubs': [50, 50],
			'Organizations': [50, 150],
			'Faculty': [50, 250],
			'Programs': [50, 350],
		}
		
		// Add Nodes
		ret.forEach(add => {
			const node = new CircleNodeModel({ label: add.name, type: add.type, 
				data: {
						'Type': 'Faculty',
						'History': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non nisl ac eros pharetra fringilla. Nullam malesuada tempus erat. Cras vel purus rhoncus, sodales massa non, interdum mauris. Phasellus id nulla non risus posuere porttitor. Phasellus ac nisi et lectus molestie efficitur vel a eros. Proin turpis mi, auctor eget nisi ac, pharetra euismod nulla. Fusce vulputate tellus sed sapien vestibulum elementum. Ut et tellus ac diam malesuada vulputate eget eu tortor.',
						'Mission Statement': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non nisl ac eros pharetra fringilla. Nullam malesuada tempus erat. Cras vel purus rhoncus, sodales massa non, interdum mauris. Phasellus id nulla non risus posuere porttitor. Phasellus ac nisi et lectus molestie efficitur vel a eros. Proin turpis mi, auctor eget nisi ac, pharetra euismod nulla. Fusce vulputate tellus sed sapien vestibulum elementum. Ut et tellus ac diam malesuada vulputate eget eu tortor.',
						'Link': 'www.link.com',
						'How can I get Involved?': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non nisl ac eros pharetra fringilla.'
					  } 
			});
			nodes[node.type].push(node);
			allnodes.push(node);
			node.setPosition(allpos[allnodes.length-1][0], allpos[allnodes.length-1][1]);
			// To position by center:
			// setTimeout(() => {
			// 	node.setPosition(node.getX() - node.getWidth()/2, node.getY() - node.getWidth()/2);
			// })

			//For Grid:
			// pos[add.type][0]+=200;
		})
		// Add Links and Labels
		ret.forEach(source => {
			const sourcenode = allnodes.find(el => el.label === source.name);
			source.links.forEach(target => {
				const targetnode = allnodes.find(el => el.label === target);
				const link = new CustomLinkModel({curvyness: 0, width: 2});
				links[sourcenode.type].push(link);
				links[targetnode.type].push(link);
				link.setSourcePort(sourcenode.getPort('port'));
				link.setTargetPort(targetnode.getPort('port'));
				link.setLocked();
				link.setColor(this.getColor(sourcenode.type, targetnode.type));
				// link.addLabel(sourcenode.type + '::' + targetnode.type);
				link.addLabel('sponsors');
				alllinks.push(link);
			})
		})
		//4) add model to engine
		let model = new DiagramModel();
		model.addAll(...allnodes, ...alllinks);
		const engine = createEngine({ registerDefaultZoomCanvasAction: false });
		engine.getActionEventBus().registerAction(new ZoomCanvasAction({ inverseZoom: true }));
		engine.getNodeFactories().registerFactory(new CircleNodeFactory());
		engine.getLinkFactories().registerFactory(new CustomLinkFactory());
		engine.getLabelFactories().clearFactories();
		engine.getLabelFactories().registerFactory(new CustomLabelFactory());
		engine.setModel(model);
		this.setState({engine: engine}, this.resetZoom)
	}

	// Fit all nodes
	resetZoom() {
		setTimeout(() => {
			const tempengine = this.state.engine;
			tempengine.getModel().clearSelection();
			tempengine.zoomToFitNodes(40);
			this.setState({engine: tempengine})
		})
	}

	// Update which categories are displayed
	updateModel(data) {
		let model = this.state.engine.getModel();
		if(!data.checked) {
			links[data.label].forEach(rem => {
				model.removeLink(rem);
			})
			nodes[data.label].forEach(rem => {
				model.removeNode(rem);
			})
		}
		else if(data.checked) {
			links[data.label].forEach(add => {
				const active = Object.values(model.getActiveNodeLayer().getNodes());
				if(active.includes(add.getSourcePort().getParent()) || active.includes(add.getTargetPort().getParent()))
				model.addLink(add);
			})
			nodes[data.label].forEach(add => {
				model.addNode(add);
			})
		}
		this.state.engine.setModel(model);
	}

	render() {
		return (
			<div style = {{height:'100vh',width:'100vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<div style = {{margin: 20}}><Button onClick = {() => this.resetZoom()}>Reset</Button></div>
				<div style = {{overflow: 'hidden', borderRadius: '10px', height: '90vh', width: '90vh'}}>
					<div style = {{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', background: '#DDDDDD', height: 30, width: '100%'}}>
						{
							types.map(type => {
								return <Checkbox defaultChecked = {true} key = {type} label = {type}
										onChange = {(e, data) => {
											this.updateModel(data)
										}}>	
										</Checkbox>
							})
						}
					</div>
					<DemoCanvasWidget>
						<CanvasWidget engine={this.state.engine}>
						</CanvasWidget>
					</DemoCanvasWidget>
				</div>
			</div>
		);
	}
};

export default Graph;