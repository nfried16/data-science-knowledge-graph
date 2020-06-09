import * as React from 'react';
import { DiagramEngine, LinkWidget, PointModel } from '@projectstorm/react-diagrams-core';
import { CustomLinkModel } from './CustomLinkModel';
import { CustomLinkPointWidget } from './CustomLinkPointWidget';
import { CustomLinkSegmentWidget } from './CustomLinkSegmentWidget';
import { CustomLabelModel } from '../CustomLabel/CustomLabelModel';
import { MouseEvent } from 'react';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { resolve } from 'dns';
import { setTimeout } from 'timers';

export interface CustomLinkProps {
	link: CustomLinkModel;
	diagramEngine: DiagramEngine;
	pointAdded?: (point: PointModel, event: MouseEvent) => any;
}

export interface CustomLinkState {
	selected: boolean;
}

export class CustomLinkWidget extends React.Component<CustomLinkProps, CustomLinkState> {
	refPaths: React.RefObject<SVGPathElement>[];

	constructor(props: CustomLinkProps) {
		super(props);
		this.refPaths = [];
		this.state = {
			selected: false,
		};
	}

	componentDidUpdate(): void {
		this.props.link.setRenderedPaths(
			this.refPaths.map(ref => {
				return ref.current;
			})
		);
	}

	componentDidMount(): void {
		this.props.link.setRenderedPaths(
			this.refPaths.map(ref => {
				return ref.current;
			})
		);
	}

	componentWillUnmount(): void {
		this.props.link.setRenderedPaths([]);
	}

	addPointToLink(event: MouseEvent, index: number) {
		if (
			!event.shiftKey &&
			!this.props.link.isLocked() &&
			this.props.link.getPoints().length - 1 <= this.props.diagramEngine.getMaxNumberPointsPerLink()
		) {
			const point = new PointModel({
				link: this.props.link,
				position: this.props.diagramEngine.getRelativeMousePoint(event)
			});
			this.props.link.addPoint(point, index);
			event.persist();
			event.stopPropagation();
			this.forceUpdate(() => {
				this.props.diagramEngine.getActionEventBus().fireAction({
					event,
					model: point
				});
			});
		}
	}

	generatePoint(point: PointModel): JSX.Element {
		return (
			<CustomLinkPointWidget
				key={point.getID()}
				point={point as any}
				colorSelected={this.props.link.getOptions().selectedColor}
				color={this.props.link.getOptions().color}
			/>
		);
	}

	getAngle(px1, py1, px2, py2) { 
		const x = px2-px1; 
		const y = py2-py1; 
		const hypotenuse = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2)); 
		let cos = x/hypotenuse; 
		let radian = Math.acos(cos); 
		let angle = 180/(Math.PI/radian); 
		if (y<0) { 
		  angle = -angle; 
		} else if ((y == 0) && (x<0)) { 
		  angle = 180; 
		} 
		return angle; 
	}

	generateLink(path: string, extraProps: any, id: string | number): JSX.Element {
		let source = this.props.link.getSourcePort();
		let target = this.props.link.getTargetPort();
		let p1 = source.getPosition();
		let p2 = target.getPosition();
		let angle = this.getAngle(p1.x, p1.y, p2.x, p2.y);
		let w = target.getNode().getBoundingBox().getWidth();
		let h = target.getNode().getBoundingBox().getHeight(); 
		let rat = Math.atan(h/w)*180/Math.PI;
		var disp = [w/2, h/2]
		if(angle >= -rat && angle <= rat)
			disp[1] = (w/2)*Math.tan(angle*Math.PI/180);
		else if(angle >= rat && angle <= (180-rat))
			disp[0] = (h/2)*Math.tan((90-angle)*Math.PI/180);
		else if(angle >= (180-rat) || angle <= (rat-180)) {
			disp[0] = -disp[0];
			disp[1] = -(w/2)*Math.tan((180+angle)*Math.PI/180);
		}
		else {
			disp[1] = -disp[1];
			disp[0] = -(h/2)*Math.tan((90-angle)*Math.PI/180);
		}
		const dx = disp[0];
		const dy = disp[1];
		let x = target.getX() - .95*dx;
		let y = target.getY() - .95*dy;
		const ref = React.createRef<SVGPathElement>();
		this.refPaths.push(ref);
		return (
			<svg key = {`arrow-${id}`}>
				<CustomLinkSegmentWidget
					key={`link-${id}`}
					path={path}
					selected={this.state.selected}
					diagramEngine={this.props.diagramEngine}
					factory={this.props.diagramEngine.getFactoryForLink(this.props.link)}
					link={this.props.link}
					forwardRef={ref}
					onSelection={selected => {
						this.setState({ selected: selected }, () => {
						this.props.link.getLabels()[0].setSelected(selected);
						this.props.diagramEngine.repaintCanvas();
						});
					}}
					extras={extraProps}
				/>
				<polygon 
					fill = '#FF0000'
					x={x}
					y={y}
					transform={`rotate(${angle}, ${x}, ${y})`}
					points={`${x - 10},${y - 8} ${x},${y} ${x - 10},${y + 8}`}
				/>
			</svg>
		);
	}

	render() {
		//ensure id is present for all points on the path
		var points = this.props.link.getPoints();
		var paths = [];
		this.refPaths = [];

		if (points.length === 2) {
			paths.push(
				this.generateLink(
					this.props.link.getSVGPath(),
					{
						onMouseDown: event => {
							this.addPointToLink(event, 1);
						}
					},
					'0'
				)
			);

			// draw the link as dangeling
			if (this.props.link.getTargetPort() == null) {
				paths.push(this.generatePoint(points[1]));
			}
		} else {
			//draw the multiple anchors and complex line instead
			for (let j = 0; j < points.length - 1; j++) {
				paths.push(
					this.generateLink(
						LinkWidget.generateLinePath(points[j], points[j + 1]),
						{
							'data-linkid': this.props.link.getID(),
							'data-point': j,
							onMouseDown: (event: MouseEvent) => {
								this.addPointToLink(event, j + 1);
							}
						},
						j
					)
				);
			}

			//render the circles
			for (let i = 1; i < points.length - 1; i++) {
				paths.push(this.generatePoint(points[i]));
			}

			if (this.props.link.getTargetPort() == null) {
				paths.push(this.generatePoint(points[points.length - 1]));
			}
		}
		return <g data-custom-link-test={this.props.link.getOptions().testName}>{paths}</g>;
	}
}
