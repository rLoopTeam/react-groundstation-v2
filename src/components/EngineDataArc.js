import React, { Component } from 'react';
import { Arc, Circle, Layer, Group, Stage } from 'react-konva';
import StreamingPageManager from '../StreamingPageManager.js';
import packetDefinitions from '../../config/packetDefinitions.json';
import GenericParameterDisplay from './displaycomponents/GenericParameterDisplay.js';
import SystemGraphic from './SystemGraphic.js';

class EngineDataArc extends GenericParameterDisplay {
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

  genTachs () {
    let arr = [];
    let xOriginal = 240;
    let yOriginal = 90;
    let xOffset = 0;
    let yOffset = 0;
    let i = 0;
    this.trackParams.forEach(function (element) {
      if ((element['Name'].indexOf('Current RPM')) !== -1) {
        console.log(arr);
        if (i >= 4 && i <= 7) {
          xOffset = 120;
          if (i === 4) {
            yOffset = 0;
          }
          if (i === 5) {
            yOffset = 55;
          }
          if (i === 6) {
            yOffset = 225;
          }
          if (i === 7) {
            yOffset = 280;
          }
        }
        if (i === 1) {
          yOffset = 55;
        }
        if (i === 2) {
          yOffset = 225;
        }
        if (i === 3) {
          yOffset = 280;
        }

        arr.push(
        <Group key={'Group ' + (element['Name'])}>
        <Arc
          key={'EngineArc ' + (element['Name'])}
          StreamingPageManager={this.state.streamManager}
          parameter={element['Name']}
          x={xOriginal + xOffset}
          y={yOriginal + yOffset}
          innerRadius={20}
          outerRadius={26}
          angle={(this.state.value / 3000) * 365}
          fill={this.state.color}
        />
        <Circle
          key={'EngineCentre ' + (element['Name'])}
          x={xOriginal + xOffset}
          y={yOriginal + yOffset}
          radius={20}
          fill={'darkgrey'}
        />
        </Group>
      );
        i++;
      }
    }, this);
    return arr;
  }

  render () {
    return (
      <Stage width={600} height={500}>
      <Layer>
      <SystemGraphic />
      </Layer>
      <Layer>
      {this.genTachs()}
      </Layer>
      </Stage>
    );
  }
    }

export default EngineDataArc;
