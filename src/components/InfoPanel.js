import React, { Component } from 'react';
import StreamingPageManager from '../StreamingPageManager.js';
import GenericParameterLabel from './displaycomponents/GenericParameterLabel.js';
import StatsModal from './StatsModal.js';
import Stop from './Stop.js';
import ConfirmButton from './buttons/ConfirmButton.js';
// import GenericParameterInput from './GenericParameterInput.js';
import './InfoPanel.css';

import createSocket from '../shared/socket';
let socket = createSocket();

class InfoPanel extends Component {
  constructor (props) {
    super(props);
    this.state = {
      streamManager: new StreamingPageManager(),
      showConnectionModal: false,
      info: {
      }
    };
  }

  componentDidMount () {
    var _this = this;
    this._isMounted = true;
  }

  toggleModalVisibility () {
    this.setState({showConnectionModal: !this.state.showConnectionModal});
  }

  isModalVisible () {
    return (this.state.showConnectionModal) ? {display: 'block'} : {display: 'none'};
  }

  resetPod () {
    socket.emit('ForcePreRunPhase');
  }

  render () {
    return (
      <footer className="navbar-default info-panel" >
        <div className="container-fluid">
          <StatsModal className="col-xs-2" isVisible={this.state.showConnectionModal} isVisibleHandler={this.toggleModalVisibility.bind(this)}/>
          <div className="InfoPanel-content">
            <ConfirmButton className="btn btn-danger col-sm-2" delay={2000} action={this.resetPod}>Force pre-run phase</ConfirmButton>
            <button className="btn btn-primary col-sm-1" onClick={this.toggleModalVisibility.bind(this)}>Faults</button>
            <div className="col-sm-1">Power A Status:<GenericParameterLabel StreamingPageManager={this.state.streamManager} parameter='Power Node A network status'/></div>
            <div className="col-sm-1">Power B Status:<GenericParameterLabel StreamingPageManager={this.state.streamManager} parameter='Power Node B network status'/></div>
            <div className="col-sm-1">FCU Status:<GenericParameterLabel StreamingPageManager={this.state.streamManager} parameter='Flight Control network status'/></div>
            <Stop />
          </div>
        </div>
      </footer>
    );
  }
}

export default InfoPanel;
