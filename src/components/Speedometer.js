import React from 'react';
import { Rect, Text, Layer, Group, Stage } from 'react-konva';
import StreamingPageManager from '../StreamingPageManager.js';

import GenericParameterDisplay from './displaycomponents/GenericParameterDisplay.js';

class Speedometer extends GenericParameterDisplay {

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

  genSpeedometer () {
    let xOriginal = 40;
    let yOriginal = 90;
    let xOffset = 120;
    let yOffset = -45;
    let speedWidth = 0;
    let groundSpeed = 0;
    let maxSpeed = 1000;
    let totalWidth = 200;

    let arr = [];

    this.props.parameters.forEach(function (paramName) {
      speedWidth = ((this.state.latestValue[paramName].value / maxSpeed) * 200);

      arr.push(
        < Group key={'Group ' + (paramName)} >
          <Text
            key={'SpeedText ' + (paramName)}
            parameter={paramName}
            x={xOriginal + xOffset}
            y={yOriginal + yOffset}
            text={Number(this.getFormattedValue(paramName)).toFixed(2) + ' km/h'}
            fontSize={40}
          />
          <Rect
            key={'BaseRect ' + (paramName)}
            parameter={paramName}
            x={xOriginal}
            y={yOriginal}
            height={10}
            width={totalWidth}
            fill={'lightgrey'}
          />
          <Rect
            key={'SpeedRect ' + (paramName)}
            parameter={paramName}
            x={xOriginal}
            y={yOriginal}
            height={10}
            width={speedWidth}
            fill={'darkgreen'}
          />
        </Group >
      );
    }.bind(this));
    return arr;
  }

  render () {
    return (
      <Stage width={400} height={430}>
        <Layer>
          {this.genSpeedometer()}
        </Layer>
      </Stage>
    );
  }
}

export default Speedometer;
