import createEngine, { DiagramModel, DefaultNodeModel, DefaultLinkModel } from '@projectstorm/react-diagrams';
import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import styled from '@emotion/styled';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget'

export default () => {
	//1) setup the diagram engine
	var engine = createEngine();
	//2) setup the diagram model
	var model = new DiagramModel();
	model.setLocked(true);
	//3-A) create a default node
	var node1 = new DefaultNodeModel('Data+', 'rgb(0,192,255)');
	node1.setPosition(100, 100);
	let port1 = node1.addOutPort('Out');
	//3-B) create another default node
	var node2 = new DefaultNodeModel('DAML', 'rgb(192,255,0)');
	let port2 = node2.addInPort('In');
	node2.setPosition(400, 100);
	//3-C) another
	var node3 = new DefaultNodeModel('DUML', 'rgb(255,0,192)');
	let port3 = node3.addInPort('Out');
	node3.setPosition(700, 100);
	// link the ports
	let link1 = port1.link<DefaultLinkModel>(port2);
	let link2 = port2.link<DefaultLinkModel>(port3);
	//4) add the models to the root graph
	model.addAll(node1, node2, node3, link1, link2);
	//5) load model into engine
	engine.setModel(model);
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
		<Container>
			<FullscreenCanvas>
				<CanvasWidget engine={engine} />
			</FullscreenCanvas>
		</Container>
	);
};