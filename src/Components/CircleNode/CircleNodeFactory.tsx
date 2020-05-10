import * as React from 'react';
import { CircleNodeModel } from './CircleNodeModel';
import { CircleNodeWidget } from './CircleNodeWidget';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class CircleNodeFactory extends AbstractReactFactory<CircleNodeModel, DiagramEngine> {
	constructor() {
		super('circle-node');
	}

	generateModel(initialConfig) {
		return new CircleNodeModel();
	}

	generateReactWidget(event): JSX.Element {
		return <CircleNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}