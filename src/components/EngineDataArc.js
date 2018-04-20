import React, { Component } from 'react';
import { Arc } from 'react-konva';
import Konva from 'konva';
import StreamingPageManager from '../StreamingPageManager.js';

class EngineDataArc extends React.Component {
  state = {
    color: 'green'
  };
  render () {
    // this.Current_RPM = [
    //         {label: 'Current RPM 1', value: 'Throttle Current RPM 1'},
    //         {label: 'Current RPM 2', value: 'Throttle Current RPM 2'},
    //         {label: 'Current RPM 3', value: 'Throttle Current RPM 3'},
    //         {label: 'Current RPM 4', value: 'Throttle Current RPM 4'},
    //         {label: 'Current RPM 5', value: 'Throttle Current RPM 5'},
    //         {label: 'Current RPM 6', value: 'Throttle Current RPM 6'},
    //         {label: 'Current RPM 7', value: 'Throttle Current RPM 7'},
    //         {label: 'Current RPM 8', value: 'Throttle Current RPM 8'}
    // ];
    // for (var he = 1; he < 9; he++) {
    //   var paramsArr = [];
    //   paramsArr.push(this.Current_RPM[he - 1]);
    //   hes.push({name: 'HE ' + he, params: paramsArr});
    // }
    return (
      // {hes.map(function (item, index) {
      //   if (index < 4) {
      //     return (
      //         {item.params.map(function (iitem, iindex) {
      //           return (
      //             <GenericParameterLabel StreamingPageManager={_this.state.streamManager} parameter={iitem.value}/>
      //           );
      //         })}
      //     ); }
      // })
      // }
      <Arc
        x={215}
        y={90}
        innerRadius={20}
        outerRadius={30}
        angle={270}
        fill={this.state.color}
      />
    );
  }
}

export default EngineDataArc;
