import { DiagramEngine, LabelModel, LabelModelGenerics, LabelModelOptions } from '@projectstorm/react-diagrams-core';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';

export interface CustomLabelModelOptions extends LabelModelOptions {
	label?: string;
}

export interface CustomLabelModelGenerics extends LabelModelGenerics {
	OPTIONS: CustomLabelModelOptions;
}

export class CustomLabelModel extends LabelModel<CustomLabelModelGenerics> {
	constructor(options: CustomLabelModelOptions = {}) {
		super({
			offsetY: options.offsetY == null ? -23 : options.offsetY,
			type: 'custom',
			...options
		});
	}

	setLabel(label: string) {
		this.options.label = label;
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.label = event.data.label;
	}

	serialize() {
		return {
			...super.serialize(),
			label: this.options.label
		};
	}
}
