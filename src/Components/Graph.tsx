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
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { INSPECT_MAX_BYTES } from 'buffer';
import { CustomLabelModel } from './CustomLabel/CustomLabelModel';

const linkcolors = {
	'Organizations::Faculty': '#000000',
	'Organizations::Programs': '#000000',
	'Organizations::Hubs': '#000000',
	'Faculty::Programs': '#000000',
	'Faculty::Hubs': '#000000',
	'Programs::Hubs': '#000000'
}

const types = [
	'Organizations',
	'Hubs',
	'Faculty',
	'Programs',
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
		return '#000000';
	}

	getRow(nodenum: number) {
		return Math.ceil((1+Math.sqrt(1-4*(1-nodenum)))/2);
	}

	getNodesRow(row: number) {
		if(row == 1) 
			return 1;
		return (row-1)*2;
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

		// Temp Random Nodes/Links
		for(var i = 0; i < 60; i++) {
			let name = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, Math.random()*10+4);
			let type = types[Math.floor(Math.random()*4)];
			ret.push({name: name, type: type, links: [] });
		}
		for(var j = 0; j < ret.length; j++) {
			if(Math.random()<.3) {
				let ind = Math.floor(Math.random()*ret.length);
				if(ind != j)
					ret[j].links.push(ret[ind].name);
			}
		}

		// Get amount of each type
		let amounts = {
			'Hubs': 0,
			'Programs': 0,
			'Organizations': 0,
			'Faculty': 0,
		}
		ret.forEach(node => {
			amounts[node.type]++;
		})
		// Setting up layout of nodes
		const allrows = {
			'Hubs': this.getRow(amounts['Hubs']),
			'Programs': this.getRow(amounts['Programs']),
			'Organizations': this.getRow(amounts['Organizations']),
			'Faculty': this.getRow(amounts['Faculty']),
		}
		const rows = Math.max(...Object.values(allrows));
		let tot = (rows-1)*(rows-2)+1;
		let lastrows = {
			'Hubs': tot,
			'Programs': tot,
			'Organizations': tot,
			'Faculty': tot,
		}
		let last = {
			'Hubs': amounts['Hubs']- tot,
			'Programs': amounts['Programs'] - tot,
			'Organizations': amounts['Organizations'] - tot,
			'Faculty': amounts['Faculty'] - tot,
		}
		Object.keys(last).forEach(lam => {
			if(last[lam] < 0) {
				last[lam] = this.getNodesRow(rows-1)+last[lam];
				lastrows[lam] = (rows-2)*(rows-3)+1;
			}
		})
		// Create clusters
		let allpos = [];
		let curr = {
			'Hubs': 1,
			'Programs': 1,
			'Organizations': 1,
			'Faculty': 1,
		}
		let base = {
			'Faculty': 0,
			'Programs': Math.PI/2,
			'Organizations': Math.PI,
			'Hubs': 3*Math.PI/2,
		}
		for(var n = 0; n < ret.length; n++) {
			let row = this.getRow(curr[ret[n].type]);
			let r = 120*row/(allrows[ret[n].type]/rows);
			let currinrow = row*(row-1)+2-curr[ret[n].type];
			let a = 0;
			console.log(ret[n].type + '---' + curr[ret[n].type] + '---' + lastrows[ret[n].type])
			if(curr[ret[n].type] > lastrows[ret[n].type]) {
				currinrow = amounts[ret[n].type] - curr[ret[n].type] + 1;
				a = base[ret[n].type] + currinrow*((Math.PI/2)/(last[ret[n].type] + 1));
			}
			else
				a = base[ret[n].type] + currinrow*((Math.PI/2)/(this.getNodesRow(row)+1));
			allpos.push({x: 1.75*r*Math.cos(a) + Math.random()*100-50, y: r*Math.sin(a) + Math.random()*80-40})
			curr[ret[n].type]++;
		}
		/*
		// For Circle Layout
		let t = 0;
		let c = 1;
		while(t < ret.length) {
			let r = 120*(c-1);
			for(var i = 0; i < Math.pow(c, 2); i++) {
				if(t + i > ret.length)
					break;
				let a = 2*Math.PI/Math.pow(c, 2)*i;
				allpos.push({x: 1.5*r*Math.cos(a) + Math.random()*100-50, y: r*Math.sin(a) + Math.random()*100-50});
			}
			t = t+i;
			c++;
		}*/
		// Add Nodes
		ret.forEach(add => {
			const node = new RectangleNodeModel({ label: add.name, type: add.type, 
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
			node.setPosition(allpos[allnodes.length-1].x, allpos[allnodes.length-1].y);
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
		alllinks.forEach(link => {
			link.setSelected(true);
		})
		engine.getActionEventBus().registerAction(new ZoomCanvasAction({ inverseZoom: true }));
		engine.getNodeFactories().registerFactory(new CircleNodeFactory());
		engine.getNodeFactories().registerFactory(new RectangleNodeFactory());
		engine.getLinkFactories().registerFactory(new CustomLinkFactory());
		engine.getLabelFactories().clearFactories();
		engine.getLabelFactories().registerFactory(new CustomLabelFactory());
		engine.setModel(model);
		this.setState({engine: engine}, this.resetZoom);
	}

	// Fit all nodes
	async resetZoom() {
		await new Promise((resolve, reject) =>  {
			setTimeout(() => {
				const tempengine = this.state.engine;
				tempengine.getModel().clearSelection();
				tempengine.zoomToFitNodes(50)
				this.state.engine.getModel().setOffsetX(window.innerWidth/2)
				this.setState({engine: tempengine});
				resolve()
			})
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
				<div style = {{height: '100%', width: '100%'}}>
					<div style = {{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', background: '#DDDDDD', height: '5vh', width: '100%'}}>
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