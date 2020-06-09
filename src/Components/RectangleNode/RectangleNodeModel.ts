import { NodeModel, DefaultPortModel } from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

export interface RectangleNodeModelOptions extends BaseModelOptions {
	type?: string;
	label?: string;
	data?: object;
}

export class RectangleNodeModel extends NodeModel {
    type: string;
	label: string;
	data: object;

	constructor(options: RectangleNodeModelOptions = {}) {
		super({
			...options,
			type: 'rectangle-node'
		});
        this.type = options.type || 'Hubs';
		this.label = options.label || 'Enter Label';
		this.data = options.data || {};

		// setup an in and out port
		this.addPort(
			new DefaultPortModel({
				in: false,
				name: 'port'
			})
		);
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	serialize() {
		return {
			...super.serialize(),
            type: this.type,
			label: this.label,
			data: this.data,
		};
	}

	deserialize(event): void {
		super.deserialize(event);
        this.type = event.data.type;
		this.label = event.data.label;
		this.data = event.data.data;
	}
}