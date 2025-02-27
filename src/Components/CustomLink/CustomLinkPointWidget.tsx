import * as React from 'react';
import { PointModel } from '@projectstorm/react-diagrams-core';
import styled from '@emotion/styled';

export interface CustomLinkPointWidgetProps {
	point: PointModel;
	color?: string;
	colorSelected: string;
}

export interface CustomLinkPointWidgetState {
	selected: boolean;
}

export const PointTop = styled.circle`
	pointer-events: all;
`;

export class CustomLinkPointWidget extends React.Component<CustomLinkPointWidgetProps, CustomLinkPointWidgetState> {
	constructor(props) {
		super(props);
		this.state = {
			selected: false
		};
	}

	render() {
		const { point } = this.props;
		console.log(point)
		return (
			<g>
				<circle
					cx={point.getPosition().x}
					cy={point.getPosition().y}
					r={5}
					fill={this.state.selected || this.props.point.isSelected() ? this.props.colorSelected : this.props.color}
				/>
				<PointTop
					className="point"
					onMouseLeave={() => {
						this.setState({ selected: false });
					}}
					onMouseEnter={() => {
						this.setState({ selected: true });
					}}
					data-id={point.getID()}
					data-linkid={point.getLink().getID()}
					cx={point.getPosition().x}
					cy={point.getPosition().y}
					r={15}
					opacity={0.0}
				/>
			</g>
		);
	}
}
