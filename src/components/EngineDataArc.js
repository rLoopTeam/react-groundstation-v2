import React from 'react';
import { Arc, Circle, Text, Layer, Group, Stage } from 'react-konva';
import StreamingPageManager from '../StreamingPageManager.js';

import GenericParameterDisplay from './displaycomponents/GenericParameterDisplay.js';
import SystemGraphic from './SystemGraphic.js';

class EngineDataArc extends GenericParameterDisplay {
  constructor (props) {
    super(props);
    this.state = {
      color: 'green',
      latestValue: {}
    };

    // sets up the StreamingPage manager for each parameter we want to display
    for (let i = 0; i < this.props.parameters.length; i++) {
      (function (index, myObj) {
        myObj.state.latestValue[myObj.props.parameters[index]] = {
          stale: false,
          value: 0,
          units: ''
        };
        myObj.props.StreamingPageManager.RequestParameterWithCallback(myObj.props.parameters[index], function (data) {
          myObj.dataCallback(data, index);
        });
      })(i, this);
    }
  }

  dataCallback (parameterData, i) {
    // update the latestValues object with values from the pod
    if (this._isMounted) {
      this.state.latestValue[parameterData.Name].value = parameterData.Value;
      this.state.latestValue[parameterData.Name].stale = parameterData.IsStale;
      this.state.latestValue[parameterData.Name].units = parameterData.Units;
      this.setState({ counter: this.state.counter + 1 });
    }
  }

  getFormattedValue (paramName) {
    return this.state.latestValue[paramName].value;
  }

  genTachs () {
    let arr = [];
    let xOriginal = 110;
    let yOriginal = 90;
    let xOffset = 0;
    let yOffset = 0;
    let i = 0;
    this.props.parameters.forEach(function (paramName) {
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
        <Group key={'Group ' + (paramName)}>
          <Arc
            key={'EngineArc ' + (paramName)}
            parameter={paramName}
            x={xOriginal + xOffset}
            y={yOriginal + yOffset}
            innerRadius={20}
            outerRadius={26}
            angle={(this.getFormattedValue(paramName) / 3000) * 360}
            fill={this.state.color}
            test={this.state.latestValue[paramName].value}
          />
          <Circle
            key={'EngineCentre ' + paramName}
            x={xOriginal + xOffset}
            y={yOriginal + yOffset}
            radius={20}
            fill={'darkgrey'}
          />
          <Text
            key={'EnginePercentLabel ' + (paramName)}
            parameter={paramName}
            x={xOriginal + xOffset - 13}
            y={yOriginal + yOffset - 5}
            text={Number((this.getFormattedValue(paramName) / 3000) * 100).toFixed(0) + '%'}
          />
        </Group>
      );
      i++;
    }.bind(this));
    return arr;
  }

  render () {
    return (
      <Stage width={400} height={430}>
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
