import React, { Component } from 'react';
import StreamingPageManager from './../StreamingPageManager';
import GenericParameterLabel from './displaycomponents/GenericParameterLabel';
import NumericInput from './displaycomponents/NumericInput';

import createSocket from '../shared/socket';
let socket = createSocket();

class Simulator_Control extends Component {
  constructor (props) {
    super(props);
    this.render = this.render;

    this.state = {
      streamManager: new StreamingPageManager(),

      selectedPin: '4'
    };

    this.labels = [
      {label: 'BMS Faults', value: `Power ${props.route.L} BMS Faults`, hex: 'true'},
      {label: 'Temp State', value: `Power ${props.route.L} BMS Temp State`},
      {label: 'Charger State', value: `Power ${props.route.L} BMS Charger State`},
      {label: 'Num Temp Sensors', value: `Power ${props.route.L} BMS Num Temp Sensors`},
      {label: 'Highest Sensor Value', value: `Power ${props.route.L} BMS Highest Sensor Value`},
      {label: 'Average Temp', value: `Power ${props.route.L} BMS Average Temp`},
      {label: 'Highest Sensor Index', value: `Power ${props.route.L} BMS Highest Sensor Index`},
      {label: 'Pack Current', value: `Power ${props.route.L} BMS Battery Current`},
      {label: 'Charge Current', value: `Power ${props.route.L} BMS Charging Current`},
      {label: 'State of Charge', value: `Power ${props.route.L} BMS State of Charge`}
    ];
  }

  componentDidMount () {
    var _this = this;
    this._isMounted = true;
  }
  componentWillUnmount () {
    this._isMounted = false;
  }
  // example of command
  startSim (e) {
    e.preventDefault();
    socket.emit(`PySim:StartSim`);
  }
  pauseSim (e) {
    e.preventDefault();
    socket.emit(`PySim:PauseSim`);
  }
  resumeSim (e) {
    e.preventDefault();
    socket.emit(`PySim:ResumeSim`);
  }
  stopSim (e) {
    e.preventDefault();
    socket.emit(`PySim:StopSim`);
  }
  startLogging (e) {
    e.preventDefault();
    socket.emit(`PySim:StartLogging`);
  }
  stopLogging (e) {
    e.preventDefault();
    socket.emit(`PySim:StopLogging`);
  }
  startPush (e) {
    e.preventDefault();
    socket.emit(`PySim:StartPusher`);
  }
  resetSim (e) {
    e.preventDefault();
    socket.emit(`PySim:ResetSim`);
  }
  resetFcu (e) {
    e.preventDefault();
    socket.emit(`PySim:ResetFcu`, null);
  }
  render () {
    var _this = this;
    var buttonClasses = 'btn btn-primary ' + ((this.state.developmentMode) ? '' : 'disabled');

    let borderStyle = {border: '2px solid black', borderRadius: '10px', padding: '10px', width: '50%'};

    return (
      <div>
        <h2>Sim Control Interface</h2>
        <div className="row">
          <div className="col-sm-5">
            <h3 className="section-title">Playback Controls</h3>
            <button type="button" className="btn btn-success" onClick={this.startSim.bind(this)} style={{margin: 10}}>Start Simulator</button>
            <button type="button" className="btn btn-warning" onClick={this.pauseSim.bind(this)} style={{margin: 10}}>Pause Simulator</button>
            <button type="button" className="btn btn-primary" onClick={this.resumeSim.bind(this)} style={{margin: 10}}>Resume Simulator</button>
            <button type="button" className="btn btn-danger" onClick={this.stopSim.bind(this)} style={{margin: 10}}>Stop Simulator</button><br />
          </div>
        </div>
      </div>
    );
  }
}

export default Simulator_Control;
