import * as React from 'react';
import { RectangleNodeModel } from './RectangleNodeModel';
import { RectangleNodeWidget } from './RectangleNodeWidget';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class RectangleNodeFactory extends AbstractReactFactory<RectangleNodeModel, DiagramEngine> {
	constructor() {
		super('rectangle-node');
	}

	generateModel(initialConfig) {
		return new RectangleNodeModel();
	}

	generateReactWidget(event): JSX.Element {
		return <RectangleNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}