import React, { Component } from 'react';
import { Arc, Circle, Layer, Stage } from 'react-konva';
import StreamingPageManager from '../StreamingPageManager.js';
import packetDefinitions from '../../config/packetDefinitions.json';

class EngineDataArc extends Component {
  constructor (props) {
    super(props);
    this.state = {
      streamManager: new StreamingPageManager(),
      color: 'green'
    };
    this.trackParams = [];
    packetDefinitions['packetDefinitions'].forEach(function (element) {
      if (element['Name'] === 'Throttle Parameters') {
        this.trackParams = element['Parameters'];
        return;
      }
    }, this);
  }

  genArcs () {
    let arr = [];
    this.trackParams.forEach(function (element) {
      if (element['Name'].substring(0, 10) === 'Current RPM') {
        arr.push(
        <Layer>
        <Arc
          key={'EngineArc' + (element)}
          StreamingPageManager={this.state.streamManager}
          parameter={element['Name']}
          x={215 + (element * 2)}
          y={90}
          innerRadius={20}
          outerRadius={30}
          angle={100}
          fill={this.state.color}
        />
        <Circle
          key={'EngineCentre' + (element)}
          x={215 + (element * 2)}
          y={90}
          radius={20}
          fill={'darkgrey'}
        />
        </Layer>
      );
      }
    }, this);
    return arr;
  }

  render () {
    return (
      <Stage>
      <Layer>
      {this.genArcs()}
      </Layer>
      </Stage>
    );
  }
    }

export default EngineDataArc;
