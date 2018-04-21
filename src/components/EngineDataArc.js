import React, { Component } from 'react';
import { Arc, Layer } from 'react-konva';
import StreamingPageManager from '../StreamingPageManager.js';

class EngineDataArc extends Component {
  constructor (props) {
    super(props);
    this.state = {
      streamManager: new StreamingPageManager(),
      color: 'green'
    };

    this.Current_RPM = [
            {label: 'Current RPM 1', value: 'Throttle Current RPM 1'},
            {label: 'Current RPM 2', value: 'Throttle Current RPM 2'},
            {label: 'Current RPM 3', value: 'Throttle Current RPM 3'},
            {label: 'Current RPM 4', value: 'Throttle Current RPM 4'},
            {label: 'Current RPM 5', value: 'Throttle Current RPM 5'},
            {label: 'Current RPM 6', value: 'Throttle Current RPM 6'},
            {label: 'Current RPM 7', value: 'Throttle Current RPM 7'},
            {label: 'Current RPM 8', value: 'Throttle Current RPM 8'}
    ];
  }
  render () {
    var _this = this;
    return (
      <div>
      {this.Current_RPM.map(function (item, index) {
        return (
      <Layer>
      <Arc
        key={'items' + (index * 2)}
        StreamingPageManager={_this.state.streamManager}
        parameter={item.value}
        x={215 + index}
        y={90}
        innerRadius={20}
        outerRadius={30}
        angle={(item.value / 3000) * 360}
        fill={this.state.color}
      />
      </Layer>
        );
      })}
</div>
    );
  }
}

export default EngineDataArc;
