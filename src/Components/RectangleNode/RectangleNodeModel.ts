import { NodeModel, DefaultPortModel } from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

export interface RectangleNodeModelOptions extends BaseModelOptions {
    color?: string;
    label?: string;
}

export class RectangleNodeModel extends NodeModel {
    color: string;
    label: string;

	constructor(options: RectangleNodeModelOptions = {}) {
		super({
			...options,
			type: 'rectangle-node'
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