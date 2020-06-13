import * as React from 'react';
import { CustomLabelModel } from './CustomLabelModel';
import { CustomLinkWidget } from '../CustomLink/CustomLinkWidget'
import styled from '@emotion/styled';

export interface CustomLabelWidgetProps {
	model: CustomLabelModel,
}

export const Label = styled.div`
	background: rgba(255, 255, 255, 0);
	border-radius: 5px;
	color: rgb(254,54,54);
	font-weight: 700;
	font-size: 20px;
	padding: 0px 3px;
	font-family: Trebuchet MS, Helvetica, sans-serif;;
	user-select: none;
`;

export class CustomLabelWidget extends React.Component<CustomLabelWidgetProps> {
	render() {
		let source = this.props.model.getParent().getSourcePort().getPosition();
		let target = this.props.model.getParent().getTargetPort().getPosition();
		let [x1, y1, x2, y2] = [source.x, source.y, target.x, target.y];
		let angle = Math.atan((y2-y1)/(x2-x1))*180/Math.PI;
		return (
			<Label style = {{transform: `rotate(${angle}deg)`}}>{this.props.model.isSelected() && this.props.model.getOptions().label}</Label>
		);
	}
}
