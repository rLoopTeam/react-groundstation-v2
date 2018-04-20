import React, { Component } from 'react';
import { Arc, Text } from 'react-konva';
import StreamingPageManager from '../StreamingPageManager.js';

class EngineDataArc extends React.Component {
  state = {
    color: 'green'
  };
  render () {
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
    return (
        <Arc
          x={215}
          y={90}
          innerRadius={20}
          outerRadius={30}
          angle={this.Current_RPM.value('Throttle Current RPM 1')}
          fill={'green'}
        />
    );
  }
  }

export default EngineDataArc;
