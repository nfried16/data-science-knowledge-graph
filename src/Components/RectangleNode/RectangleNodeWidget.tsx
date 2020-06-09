import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { RectangleNodeModel } from './RectangleNodeModel';
import { Card } from 'semantic-ui-react';
import { ZoomCanvasAction, InputType } from '@projectstorm/react-canvas-core';

const color = {
	'Organizations': ['#1E2C3A', '#000000'],
	'Programs': ['#D4040A', '#000000'],
	'Faculty': ['#A9A9A9', '#000000'],
	'Hubs': ['#00009C', '#000000']
}

export interface RectangleNodeWidgetProps {
	node: RectangleNodeModel;
	engine: DiagramEngine;
}

export interface RectangleNodeWidgetState {}

export class RectangleNodeWidget extends React.Component<RectangleNodeWidgetProps, RectangleNodeWidgetState> {
	constructor(props: RectangleNodeWidgetProps) {
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

    disableZoom(disable) {
        if(disable)
            this.props.engine.getActionEventBus().deregisterAction(this.props.engine.getActionEventBus().getActionsForType(InputType.MOUSE_WHEEL)[0])
        else
            this.props.engine.getActionEventBus().registerAction(new ZoomCanvasAction({ inverseZoom: true }))
    }

	render() {
		return (
            <div>
                <div style = {{borderColor: color[this.props.node.type][0]}} className="rectangle-node" onMouseDown = {() => this.down = true} onMouseMove = {() => this.checkDrag(this.down)} onMouseUp = {() => this.popUp(this.drag)}>
                    <PortWidget style = {{position: 'absolute', left: '50%'}} engine={this.props.engine} port={this.props.node.getPort('port')}>
                        <div className="circle-port" />
                    </PortWidget>
                    <div style = {{margin: 5, display: 'flex', justifyItems: 'center', alignItems: 'center', position: 'relative', fontFamily: 'Calibri', fontSize: 12, whiteSpace: 'nowrap'}}>
                        <div style = {{color: color[this.props.node.type][1], position: 'absolute'}}>
                            <b>
                                {this.props.node.label}
                            </b>
                        </div>
                        <div style = {{padding: '25% 0', width: 'auto'}}>
                            <div style = {{visibility: 'hidden', height: 0, fontSize: 12}}>
                                <b>
                                    {this.props.node.label}
                                </b>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.clicked &&
                    <Card onMouseLeave = {(e) => this.disableZoom(false)} onMouseEnter = {(e) => this.disableZoom(true)} style = {{zIndex: 1, transform: 'translateX(-50%)', left: '50%', position: 'absolute', marginTop: 1, maxWidth: 300}}>
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