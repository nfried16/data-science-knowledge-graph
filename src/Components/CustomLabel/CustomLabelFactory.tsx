import * as React from 'react';
import { CustomLabelModel } from './CustomLabelModel';
import { CustomLabelWidget } from './CustomLabelWidget';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class CustomLabelFactory extends AbstractReactFactory<CustomLabelModel, DiagramEngine> {
	constructor() {
		super('custom');
	}

	generateReactWidget(event): JSX.Element {
		return <CustomLabelWidget model={event.model} />;
	}

	generateModel(event): CustomLabelModel {
		return new CustomLabelModel();
	}
}
