import React, { Component } from 'react';
import { Circle } from 'react-konva';

class EngineDataGraphic extends React.Component {
  state = {
    color: 'darkgrey'
  };
  render () {
    return (
      <Circle
        x={215}
        y={90}
        radius={20}
        fill={this.state.color}
      />
    );
  }
}

export default EngineDataGraphic;
