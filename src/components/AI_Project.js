import React, { Component } from 'react';
import StreamingPageManager from './../StreamingPageManager';
import AiCommandDisplay from './displaycomponents/AiCommandDisplay';
import GenericParameterDisplay from './displaycomponents/GenericParameterDisplay';
import GenericParameterLabel from './displaycomponents/GenericParameterLabel';

import createSocket from '../shared/socket';
let socket = createSocket();

class AI_Project extends Component {
  constructor (props) {
    super(props);
    this.render = this.render;

    this.state = {
      streamManager: new StreamingPageManager()
    };

    this.labels = [
      {label: 'Last Command Sent:', value: `Last Command AIBRAIN`, hex: 'true'}
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

    return (
      <div>
        <h2>Sim Control Interface</h2>
        <div className="row">
          <div className="col-sm-5">
            <h3 className="section-title">Playback Controls</h3>
            <button className="btn btn-success" onClick={_this.startSim.bind(this)} style={{margin: 10}}>Start Simulator</button>
            <button type="button" className="btn btn-warning" onClick={this.pauseSim.bind(this)} style={{margin: 10}}>Pause Simulator</button>
            <button type="button" className="btn btn-primary" onClick={this.resumeSim.bind(this)} style={{margin: 10}}>Resume Simulator</button>
            <button type="button" className="btn btn-danger" onClick={this.stopSim.bind(this)} style={{margin: 10}}>Stop Simulator</button><br />
          </div>
        </div>
        <br/>
        <h2>AI Interface</h2>
        <div className="row">
          <div className="col-sm-5">
            <h3 className="section-title">Status Commands</h3>
            <label>{this.labels[0].label}</label>
            <AiCommandDisplay
              StreamingPageManager={_this.state.streamManager}
              parameter={this.labels[0].value}/>
          </div>
        </div>
      </div>
    );
  }
}

export default AI_Project;
