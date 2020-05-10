import { NodeModel, DefaultPortModel } from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

export interface CircleNodeModelOptions extends BaseModelOptions {
    color?: string;
    label?: string;
}

export class CircleNodeModel extends NodeModel {
    color: string;
    label: string;

	constructor(options: CircleNodeModelOptions = {}) {
		super({
			...options,
			type: 'circle-node'
		});
        this.color = options.color || 'red';
        this.label = options.label || 'Enter Label';

		// setup an in and out port
		this.addPort(
			new DefaultPortModel({
				in: false,
				name: 'port'
			})
		);
	}

	serialize() {
		return {
			...super.serialize(),
            color: this.color,
            label: this.label
		};
	}

	deserialize(event): void {
		super.deserialize(event);
        this.color = event.data.color;
        this.label = event.data.label;
	}
}