import * as React from 'react';
import styled from '@emotion/styled';

export interface DemoCanvasWidgetProps {
	color?: string;
	background?: string;
}
export const Container = styled.div<{ color: string; background: string }>`
	height: 100%;
	background-color: ${p => p.background};
	background-size: 50px 50px;
	display: flex;
	> * {
		height: 100%;
		min-height: 100%;
		width: 100%;
	}
`;

export class DemoCanvasWidget extends React.Component<DemoCanvasWidgetProps> {
	render() {
		return (
			<Container
				background={this.props.background || 'rgb(242,244,245)'}
				color={this.props.color || 'rgba(0,0,0, 0.2)'}>
				{this.props.children}
			</Container>
		);
	}
}