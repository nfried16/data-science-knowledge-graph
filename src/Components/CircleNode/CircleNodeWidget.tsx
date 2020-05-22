import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { CircleNodeModel } from './CircleNodeModel';
import { Card } from 'semantic-ui-react';

const color = {
	'Organizations': ['#262626', '#FFFFFF'],
	'Programs': ['#DBEDF2', '#000000'],
	'Faculty': ['#FFFFFF', '#000000'],
	'Hubs': ['#00009C', '#FFFFFF']
}

export interface CircleNodeWidgetProps {
	node: CircleNodeModel;
	engine: DiagramEngine;
}

export interface CircleNodeWidgetState {}

export class CircleNodeWidget extends React.Component<CircleNodeWidgetProps, CircleNodeWidgetState> {
	constructor(props: CircleNodeWidgetProps) {
        super(props);
		this.state = {clicked: false};
    }
    state = {
        clicked: false,
    }
    down = false;
    drag = false;

    popUp(drag) {
        if(!drag) {
            this.setState({clicked: !this.state.clicked});
        }
        else 
            this.drag=false;
        this.down=false;
    }

    checkDrag(down) {
        if(down) 
            this.drag = true;
    }

    updateZoom(e, engine) {
        if(typeof this.props.node.fct == 'function') {
            if(e.type === 'mouseenter') {
                this.props.node.fct(true);
            }
            else {
                this.props.node.fct(false);
            }
        }
    }

	render() {
		return (
            <div>
                <div style = {{background: color[this.props.node.type][0]}} className="circle-node" onMouseDown = {() => this.down = true} onMouseMove = {() => this.checkDrag(this.down)} onMouseUp = {() => this.popUp(this.drag)}>
                    <PortWidget style = {{position: 'absolute', left: '50%'}} engine={this.props.engine} port={this.props.node.getPort('port')}>
                        <div className="circle-port" />
                    </PortWidget>
                    <div style = {{margin: 10, display: 'flex', justifyItems: 'center', alignItems: 'center', position: 'relative', fontFamily: 'Calibri', fontSize: 10, whiteSpace: 'nowrap'}}>
                        <div style = {{color: color[this.props.node.type][1], position: 'absolute'}}>
                            <b>
                                {this.props.node.label}
                            </b>
                        </div>
                        <div style = {{padding: '50% 0', width: 'auto'}}>
                            <div style = {{visibility: 'hidden', height: 0, fontSize: 10}}>
                                <b>
                                    {this.props.node.label}
                                </b>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.clicked &&
                    <Card onMouseLeave = {(e) => this.updateZoom(e, this.props.engine)} onMouseEnter = {(e) => this.updateZoom(e, this.props.engine)} style = {{zIndex: 1, transform: 'translateX(-50%)', left: '50%', position: 'absolute', marginTop: 1, maxWidth: 300}}>
                        <Card.Content style = {{maxHeight: 300, overflow: 'auto', whiteSpace: 'pre-line', textAlign: 'left', clear: 'both', fontSize: 11, width: '100%', color: 'black', position: 'relative'}}>
                            <Card.Header textAlign = 'center'>
                                {this.props.node.label}
                            </Card.Header>
                            {Object.entries(this.props.node.data).map(([key,value]) => {
                                if(key === 'Link') 
                                    return(<div key = {key+value}><b>{key}: </b><span><a href='https://www.google.com'>{value}</a></span></div>)
                                else
                                    return (<div key = {key+value}><b style = {{display: 'in-line'}}>{key}: </b><span>{value}</span></div>)
                            })}
                        </Card.Content>
                    </Card>
                }
			</div>
		);
	}
} 