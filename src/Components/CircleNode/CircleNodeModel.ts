import { NodeModel, DefaultPortModel } from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

export interface CircleNodeModelOptions extends BaseModelOptions {
    type?: string;
	label?: string;
	data?: object;
	fct?: object;
}

export class CircleNodeModel extends NodeModel {
    type: string;
	label: string;
	data: object;
	fct: object;

	constructor(options: CircleNodeModelOptions = {}) {
		super({
			...options,
			type: 'circle-node'
		});
        this.type = options.type || 'Organizations';
		this.label = options.label || 'Enter Label';
		this.data = options.data || {};
		this.fct = options.fct || {};

		// setup an in and out port
		this.addPort(
			new DefaultPortModel({
				in: false,
				name: 'port',
			})
		);
	}


	getWidth() {
		return this.width;
	}
	serialize() {
		return {
			...super.serialize(),
            type: this.type,
			label: this.label,
			data: this.data,
			fct: this.fct,
		};
	}

	deserialize(event): void {
		super.deserialize(event);
        this.type = event.data.type;
		this.label = event.data.label;
		this.data = event.data.data;
		this.fct = event.data.fct;
	}
}