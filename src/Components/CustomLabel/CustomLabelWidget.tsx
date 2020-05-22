import * as React from 'react';
import { CustomLabelModel } from './CustomLabelModel';
import styled from '@emotion/styled';

export interface CustomLabelWidgetProps {
	model: CustomLabelModel;
}

export const Label = styled.div`
	background: rgba(255, 255, 255, .1);
	border-radius: 5px;
	color: black;
	font-weight: 800;
	font-size: 12px;
	padding: 0px 3px;
	font-family: sans-serif;
	user-select: none;
`;

export class CustomLabelWidget extends React.Component<CustomLabelWidgetProps> {
	render() {
		return <Label>{this.props.model.getOptions().label}</Label>;
	}
}
