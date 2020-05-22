import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { RectangleNodeModel } from './RectangleNodeModel'

export interface RectangleNodeWidgetProps {
	node: RectangleNodeModel;
	engine: DiagramEngine;
}

export interface RectangleNodeWidgetState {}

export class RectangleNodeWidget extends React.Component<RectangleNodeWidgetProps, RectangleNodeWidgetState> {
	constructor(props: RectangleNodeWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div style = {{background: this.props.node.color}} className="rectangle-node">
                <PortWidget engine={this.props.engine} port={this.props.node.getPort('in')}>
                    <div className="circle-port" />
                </PortWidget>
                <div style = {{margin: 10, display: 'flex', justifyItems: 'center', alignItems: 'center', position: 'relative'}}>
                    <div style = {{position: 'absolute'}}>
                        <b>
                            {this.props.node.label}
                        </b>
                    </div>
                    <div style = {{padding: '25% 0', width: 'auto'}}>
                        <div style = {{visibility: 'hidden', height: 0}}>
                            <b>
                                {this.props.node.label}
                            </b>
                        </div>
                    </div>
                </div>
                <PortWidget engine={this.props.engine} port={this.props.node.getPort('out')}>
                    <div className="circle-port" />
                </PortWidget>
			</div>
		);
	}
} 