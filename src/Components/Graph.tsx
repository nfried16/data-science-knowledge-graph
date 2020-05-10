import createEngine, { DiagramModel, DefaultNodeModel, DefaultLinkModel, LinkModel } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import styled from '@emotion/styled';
import './main.css'
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget'
import { CircleNodeFactory } from './CircleNode/CircleNodeFactory';
import { CircleNodeModel } from './CircleNode/CircleNodeModel';
import { RectangleNodeFactory } from './RectangleNode/RectangleNodeFactory';
import { RectangleNodeModel } from './RectangleNode/RectangleNodeModel';
import { ZoomCanvasAction } from '@projectstorm/react-canvas-core';
import { findByLabelText } from '@testing-library/react';

export default () => {
	const circleengine = (() => {
		//1) setup the diagram engine
		const engine = createEngine({ registerDefaultZoomCanvasAction: false });
		engine.getActionEventBus().registerAction(new ZoomCanvasAction({ inverseZoom: true }));
		//2) setup the diagram model
		var model = new DiagramModel();
		engine.getNodeFactories().registerFactory(new CircleNodeFactory());

		//3-A) create a default node
		const node0 = new CircleNodeModel({ label: 'DAML', color: 'rgb(255,0,192)' });
		node0.setPosition(412.5, 25);
		//3-B) create another default node
		const node1 = new CircleNodeModel({ label: 'Data+', color: 'rgb(0,192,255)' });
		node1.setPosition(25, 75);
		//3-C) another
		const node2 = new CircleNodeModel({ label: 'DUML', color: 'rgb(192,255,0)' });
		node2.setPosition(400, 250);
		//3-D) another
		const node3 = new CircleNodeModel({ label: 'Research', color: 'rgb(255,192,0)' });
		node3.setPosition(75, 400);
		
		// link the ports
		const link0 = new DefaultLinkModel();
		const link1 = new DefaultLinkModel();
		const link2 = new DefaultLinkModel();
		link0.setSourcePort(node0.getPort('port'));
		link0.setTargetPort(node1.getPort('port'));
		link0.getOptions().curvyness = 0;
		link0.setLocked();
		link2.setSourcePort(node1.getPort('port'));
		link2.setTargetPort(node2.getPort('port'));
		link2.getOptions().curvyness = 0;
		link2.setLocked();
		link1.setSourcePort(node2.getPort('port'));
		link1.setTargetPort(node3.getPort('port'));
		link1.getOptions().curvyness = 0;
		link1.setLocked();

		//4) add the models to the root graph
		model.addAll(node0, node1, node2, link0, link1, link2, node3);
		//5) load model into engine
		engine.setModel(model);
		return engine;
	})()
	const rectangleengine = (() => {
		//1) setup the diagram engine
		const engine = createEngine({ registerDefaultZoomCanvasAction: false });
		engine.getActionEventBus().registerAction(new ZoomCanvasAction({ inverseZoom: true }));
		//2) setup the diagram model
		var model = new DiagramModel();
		engine.getNodeFactories().registerFactory(new RectangleNodeFactory());

		//3-A) create a default node
		const node0 = new RectangleNodeModel({ label: 'DAML', color: 'rgb(255,0,192)' });
		node0.setPosition(412.5, 25);
		//3-B) create another default node
		const node1 = new RectangleNodeModel({ label: 'Data+', color: 'rgb(0,192,255)' });
		node1.setPosition(25, 75);
		//3-C) another
		const node2 = new RectangleNodeModel({ label: 'DUML', color: 'rgb(192,255,0)' });
		node2.setPosition(400, 250);
		//3-D) another
		const node3 = new RectangleNodeModel({ label: 'Research', color: 'rgb(255,192,0)' });
		node3.setPosition(75, 400);
		
		// link the ports
		const link0 = new DefaultLinkModel();
		const link1 = new DefaultLinkModel();
		const link2 = new DefaultLinkModel();
		link0.setSourcePort(node0.getPort('port'));
		link0.setTargetPort(node1.getPort('port'));
		link0.getOptions().curvyness = 0;
		link0.setLocked();
		link2.setSourcePort(node1.getPort('port'));
		link2.setTargetPort(node2.getPort('port'));
		link2.getOptions().curvyness = 0;
		link2.setLocked();
		link1.setSourcePort(node2.getPort('port'));
		link1.setTargetPort(node3.getPort('port'));
		link1.getOptions().curvyness = 0;
		link1.setLocked();

		//4) add the models to the root graph
		model.addAll(node0, node1, node2, link0, link1, link2, node3);
		//5) load model into engine
		engine.setModel(model);
		return engine;
	})()
	//6) render the diagram!
	const FullscreenCanvas = styled(DemoCanvasWidget)`
	height: 100%;
	width: 100%;
	`;
	const Container = styled.div`
	height: 100vh;
	width: 100vw;
	`;

	return (
		<div style = {{height:'100vh',width:'100vw', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
			<div style = {{overflow: 'hidden', borderRadius: '10px', backgroundColor: 'yellow', height: 500, width: 500}}>
				<FullscreenCanvas>
					<CanvasWidget engine={circleengine} />
				</FullscreenCanvas>
			</div>
			<div style = {{overflow: 'hidden', borderRadius: '10px', backgroundColor: 'yellow', height: 500, width: 500}}>
				<FullscreenCanvas>
					<CanvasWidget engine={rectangleengine} />
				</FullscreenCanvas>
			</div>
		</div>
	);
};