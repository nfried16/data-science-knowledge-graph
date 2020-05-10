import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { CircleNodeModel } from './CircleNodeModel'

export interface CircleNodeWidgetProps {
	node: CircleNodeModel;
	engine: DiagramEngine;
}

export interface CircleNodeWidgetState {}

export class CircleNodeWidget extends React.Component<CircleNodeWidgetProps, CircleNodeWidgetState> {
	constructor(props: CircleNodeWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div style = {{background: this.props.node.color}} className="circle-node">
                <PortWidget style = {{position: 'relative', left: '50%'}} engine={this.props.engine} port={this.props.node.getPort('port')}>
                    <div className="circle-port" />
                </PortWidget>
                <div style = {{margin: 10, display: 'flex', justifyItems: 'center', alignItems: 'center', position: 'relative'}}>
                    <div style = {{position: 'absolute'}}>
                        <b>
                            {this.props.node.label}
                        </b>
                    </div>
                    <div style = {{padding: '50% 0', width: 'auto'}}>
                        <div style = {{visibility: 'hidden', height: 0}}>
                            <b>
                                {this.props.node.label}
                            </b>
                        </div>
                    </div>
                </div>
			</div>
		);
	}
} 