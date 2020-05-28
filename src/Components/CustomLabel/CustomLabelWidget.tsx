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
	color: rgb(0,0,255);
	font-weight: 700;
	font-size: 20px;
	padding: 0px 3px;
	font-family: Verdana, Geneva, sans-serif;;
	user-select: none;
`;

export class CustomLabelWidget extends React.Component<CustomLabelWidgetProps> {
	render() {
		return (
			<Label>{this.props.model.isSelected() && this.props.model.getOptions().label}</Label>
		);
	}
}
