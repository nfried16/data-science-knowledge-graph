import * as React from 'react';
import { CustomLinkModel } from './CustomLinkModel';
import { CustomLinkWidget } from './CustomLinkWidget';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/core';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

	export const Keyframes = keyframes`
		from {
			stroke-dashoffset: 24;
		}
		to {
			stroke-dashoffset: 0;
		}
	`;

	const selected = css`
		stroke-dasharray: 10, 2;
		animation: ${Keyframes} 1s linear infinite;
	`;

	export const Path = styled.path<{ selected: boolean }>`
		${p => p.selected && selected};
		fill: none;
		pointer-events: all;
	`;

export class CustomLinkFactory<Link extends CustomLinkModel = CustomLinkModel> extends AbstractReactFactory<
	Link,
	DiagramEngine
> {
	constructor(type = 'custom') {
		super(type);
	}

	generateReactWidget(event): JSX.Element {
		return <CustomLinkWidget link={event.model} diagramEngine={this.engine} />;
	}

	generateModel(event): Link {
		return new CustomLinkModel() as Link;
	}

	generateLinkSegment(model: Link, selected: boolean, path: string) {
		return (
			<Path
				selected={selected}
				stroke={selected ? model.getOptions().selectedColor : model.getOptions().color}
				strokeWidth={model.getOptions().width}
				d={path}
			/>
		);
	}
}
