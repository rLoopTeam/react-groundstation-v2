import React, { Component } from 'react';
import StreamingPageManager from './../StreamingPageManager';
import createSocket from '../shared/socket';
import TextInput from './displaycomponents/TextInput';
import ConnectionStatusDisplay from './displaycomponents/ConnectionStatusDisplay';
import BackendStatusDisplay from './displaycomponents/BackendStatusDisplay';
import GenericParameterLabel from './displaycomponents/GenericParameterLabel.js';
let socket = createSocket();

class ServerControl extends Component {
  constructor (props) {
    super(props);
    this.render = this.render;

    this.state = {
      streamManager: new StreamingPageManager(),
      serverAddress: ''
    };

    this.labels = [
      {label: 'GRPC Server Status', value: `GrpcServerStatus`, hex: 'false'},
      {label: 'GRPC Server Current Endpoint', value: `GrpcServerEndPoint`, hex: 'false'},
      {label: 'DataStore Manager', value: `DataStoreManagerRunning`, hex: 'false'},
      {label: 'GRPC Server', value: `GRPCServerRunning`, hex: 'false'},
      {label: 'Broadcaster', value: `BroadcasterRunning`, hex: 'false'},
      {label: 'GS Logger', value: `GSLoggerRunning`, hex: 'false'}
    ];
  }

  genStats () {
    const length = this.labels.length;
    let statArray = [];
    for (let idx = 2; idx < length; idx++) {
      statArray.push(
        <div>
          <label>{this.labels[idx].label}</label>
          <BackendStatusDisplay
        StreamingPageManager={this.state.streamManager}
        parameter={this.labels[idx].value}/>
        </div>
      );
    }
    return statArray;
  }

  componentDidMount () {
    let _this = this;
    this._isMounted = true;
  }
  componentWillUnmount () {
    this._isMounted = false;
  }

  serverAddressHandler (changeEvent) {
    this.setState({
      serverAddress: changeEvent.currentTarget.value
    });
  }
  connectServer (e) {
    e.preventDefault();
    socket.emit('Grpc:Connect', {Address: this.state.serverAddress});
  }

  startStreaming (e) {
    e.preventDefault();
    socket.emit('Grpc:StreamPackets');
  }

  startDataStoreManager (e) {
    e.preventDefault();
    socket.emit(`Backend:StartDatastoreManager`);
  }
  stopDataStoreManager (e) {
    e.preventDefault();
    socket.emit(`Backend:StopDatastoreManager`);
  }
  render () {
    let _this = this;
    // let borderStyle = {border: '2px solid black', borderRadius: '10px', padding: '10px', width: '50%'};

    return (
      <div>
        <h2>GroundStation Backend Connection</h2>
        <div className="row">
          <div className="col-sm-5">
            <h3 className="section-title">Server Status</h3>
            <div className="row" key='labels grpc server status'>
              <label>{this.labels[0].label}</label>
              <ConnectionStatusDisplay
                StreamingPageManager={_this.state.streamManager}
                parameter={this.labels[0].value} hex={this.labels[0].hex}/>
              <GenericParameterLabel
                StreamingPageManager={_this.state.streamManager}
                parameter={this.labels[0].value}/>
              {this.genStats()}
              <GenericParameterLabel
                StreamingPageManager={_this.state.streamManager}
                parameter={this.labels[1].value}/>
              <TextInput placeHolder={'server address'} onChange={_this.serverAddressHandler.bind(_this)}/>
              <button className="btn btn-success" onClick={this.connectServer.bind(this)} style={{margin: 10}}>Connect</button><br />
            </div>
            <h3 className="section-title">Server Control</h3>
            <div className="row">
              <button className="btn btn-success" onClick={this.startStreaming.bind(this)} style={{margin: 10}}>Start Streaming</button><br />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-5">
            <h3 className="section-title">Service Control</h3>
            <button type="button" className="btn btn-success" onClick={this.startDataStoreManager.bind(this)} style={{margin: 10}}>Start Datastore Manager</button>
            <button type="button" className="btn btn-danger" onClick={this.stopDataStoreManager.bind(this)} style={{margin: 10}}>Stop Datastore Manager</button><br />
          </div>
        </div>
      </div>
    );
  }
}

export default ServerControl;
