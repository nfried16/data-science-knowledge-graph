import createEngine, { DiagramModel, DiagramEngine, NodeModelGenerics, NodeModel } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { Checkbox } from 'semantic-ui-react';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget'
import { CircleNodeFactory } from './CircleNode/CircleNodeFactory';
import { CircleNodeModel } from './CircleNode/CircleNodeModel';
import { CustomLabelFactory } from './CustomLabel/CustomLabelFactory';
import { RectangleNodeFactory } from './RectangleNode/RectangleNodeFactory';
import { RectangleNodeModel } from './RectangleNode/RectangleNodeModel';
import { ZoomCanvasAction } from '@projectstorm/react-canvas-core';
import { CustomLinkModel } from './CustomLink/CustomLinkModel';
import { CustomLinkFactory } from './CustomLink/CustomLinkFactory';
import { getRandomPositions, Position } from '../helpers/RandomPositions';
import { useState, useEffect, useRef } from 'react';
import { NodeInfo } from '../App';
import './main.css'

const types = [
	'Organizations',
	'Hubs',
	'Faculty',
	'Programs',
]

export interface GraphProps {
	nodes: NodeInfo[]
}

const Graph = (props: GraphProps) => {
	
	const [engine, setEngine] = useState(() => {
		const engine: DiagramEngine = createEngine({ registerDefaultZoomCanvasAction: false });
		const model: DiagramModel = new DiagramModel();
		engine.getActionEventBus().registerAction(new ZoomCanvasAction({ inverseZoom: true }));
		engine.getNodeFactories().registerFactory(new CircleNodeFactory());
		engine.getNodeFactories().registerFactory(new RectangleNodeFactory());
		engine.getLinkFactories().registerFactory(new CustomLinkFactory());
		engine.getLabelFactories().clearFactories();
		engine.getLabelFactories().registerFactory(new CustomLabelFactory());
		engine.setModel(model);
		return engine;
	});

	const nodesByType = useRef({
		'Organizations': [],
		'Programs': [],
		'Faculty': [],
		'Hubs': [],
	});

	const linksByType = useRef({
		'Organizations': [],
		'Programs': [],
		'Faculty': [],
		'Hubs': [],
	});

	useEffect(() => {
		setNodes();
		setLinks();
		// In order to enable arrowheads, will fix bug later and delete this
		Object.values(linksByType.current).forEach(links => {
			links.forEach(link => link.setSelected(true));
		})
		resetZoom();
	}, [])

	// Reset zoom
	const resetZoom = () => {
		// Wait until everything else is done
		setTimeout(() => {
			engine.getModel().clearSelection();
			engine.zoomToFitNodes(50)
		})
	}

	// Add nodes from props to model
	const setNodes = () => {
		const allpos: Position[] = getRandomPositions(props.nodes);
		const nodes: RectangleNodeModel[] = props.nodes.map((nodeInfo, i) => {
			const node: RectangleNodeModel = new RectangleNodeModel({
				label: nodeInfo.name, type: nodeInfo.type,
				data: nodeInfo.data || {
					'Type': 'Faculty',
					'History': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non nisl ac eros pharetra fringilla. Nullam malesuada tempus erat. Cras vel purus rhoncus, sodales massa non, interdum mauris. Phasellus id nulla non risus posuere porttitor. Phasellus ac nisi et lectus molestie efficitur vel a eros. Proin turpis mi, auctor eget nisi ac, pharetra euismod nulla. Fusce vulputate tellus sed sapien vestibulum elementum. Ut et tellus ac diam malesuada vulputate eget eu tortor.',
					'Mission Statement': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non nisl ac eros pharetra fringilla. Nullam malesuada tempus erat. Cras vel purus rhoncus, sodales massa non, interdum mauris. Phasellus id nulla non risus posuere porttitor. Phasellus ac nisi et lectus molestie efficitur vel a eros. Proin turpis mi, auctor eget nisi ac, pharetra euismod nulla. Fusce vulputate tellus sed sapien vestibulum elementum. Ut et tellus ac diam malesuada vulputate eget eu tortor.',
					'Link': 'www.link.com',
					'How can I get Involved?': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non nisl ac eros pharetra fringilla.'
				}
			});
			node.setPosition(allpos[i].x, allpos[i].y);
			nodesByType.current[nodeInfo.type].push(node);
			return node;
		});
		const model: DiagramModel = engine.getModel();
		model.addAll(...nodes);
	}

	// Add links from props to model
	const setLinks = () => {
		const links: CustomLinkModel[] = props.nodes.reduce((links, nodeInfo) => {
			nodeInfo.links.forEach(linkName => {
				const sourceNode: RectangleNodeModel = findNode(nodeInfo.name);
				const targetNode: RectangleNodeModel = findNode(linkName);
				const link = new CustomLinkModel({ curvyness: 0, width: 2 });
				link.setSourcePort(sourceNode.getPort('port'));
				link.setTargetPort(targetNode.getPort('port'));
				link.setLocked();
				link.setColor(getColor(sourceNode.type, targetNode.type));
				link.addLabel('sponsors');
				links.push(link);
				linksByType.current[sourceNode.type].push(link);
				linksByType.current[targetNode.type].push(link);
			})
			return links;
		}, [])
		const model: DiagramModel = engine.getModel();
		model.addAll(...links);
	}

	// Find node given its name
	const findNode = (name): RectangleNodeModel => {
		let foundNode: RectangleNodeModel = null;
		Object.values(nodesByType.current).some(nodes => {
				return nodes.some(node => {
					if(node.label === name) {
						foundNode = node;
						return true
					}
				})
		})
		return foundNode;
	}

	// Get Link Color
	const getColor = (t1, t2): string => {
		// For now, there is no set linkcolors array, just return black
		// let names: string[] = [t1 + '::' + t2, t2 + '::' + t1];
		// const keys: string[] = Object.keys(linkcolors);
		// if (keys.includes(names[0])) {
		// 	return linkcolors[names[0]];
		// }
		// else if (keys.includes(names[1])) {
		// 	return linkcolors[names[1]];
		// }
		return '#000000';
	}

	// Toggle category
	const changeSelected = data => {
		const model: DiagramModel = engine.getModel();
		if (!data.checked) {
			linksByType.current[data.label].forEach(link => {
				model.removeLink(link);
			})
			nodesByType.current[data.label].forEach(node => {
				model.removeNode(node);
			})
		}
		else if (data.checked) {
			const active: NodeModel<NodeModelGenerics>[] = Object.values(model.getActiveNodeLayer().getNodes());
			console.log(active)
			linksByType.current[data.label].forEach(link => {
				// If either source or target is already active, then other one must be part of this category
				if (active.includes(link.getSourcePort().getParent()) || active.includes(link.getTargetPort().getParent())) {
					model.addLink(link);
				}
			})
			nodesByType.current[data.label].forEach(node => {
				model.addNode(node);
			})
		}
		engine.setModel(model);
	}

	return (
		<div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<div style={{ height: '100%', width: '100%' }}>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', background: '#DDDDDD', height: '5vh', width: '100%' }}>
					{
						types.map(type => {
							return <Checkbox defaultChecked={true} key={type} label={type}
								onChange={(e, data) => {
									changeSelected(data)
								}}>
							</Checkbox>
						})
					}
				</div>
				<DemoCanvasWidget>
					<CanvasWidget engine={engine}>
					</CanvasWidget>
				</DemoCanvasWidget>
			</div>
		</div>
	);
}

export default Graph;
