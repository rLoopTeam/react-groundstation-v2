import React from 'react';
import HealthCheckDisplay from './HealthCheckDisplay';

class FuselageDisplay extends HealthCheckDisplay {
  constructor (props) {
    super(props);
    this.dataCallback = this.dataCallback.bind(this);

    this.state = {
      counter: 0
    };
    this.packetValues = {};

    for (let parameter of this.props.parameters) {
      this.packetValues[parameter] = 0;
    }
  }

  componentDidMount () {
    this._isMounted = true;
    for (let parameter of this.props.parameters) {
      this.props.StreamingPageManager.RequestParameterWithCallback(
        parameter,
        this.dataCallback
      );
    }
  }

  componentWillUnmount () {
    this._isMounted = false;
    this.props.StreamingPageManager.destroy();
  }

  dataCallback (parameterData) {
    if (this._isMounted) {
      // Do nothing if the states are equal.
      if (
        parameterData.Value === this.packetValues[parameterData.Name] ||
        Number(parameterData.Value).toFixed(2) ===
        this.packetValues[parameterData.Name]
      ) {
        return;
      }

      if (parameterData.IsStale) {
        this.packetValues[parameterData.Name] = NaN;
      } else if (isNaN(parameterData.Value)) {
        this.packetValues[parameterData.Name] = parameterData.Value;
      } else {
        this.packetValues[parameterData.Name] = Number(
          parameterData.Value
        ).toFixed(2);
      }

      this.setState({ counter: this.state.counter + 1 });
    }
  }

  render () {
    let className = 'fuselage data';
    var packetName;
    var substring = 'ASI';
    for (let pn in this.packetValues && this.packetValues[packetName].indexOf(substring) !== -1) {
      packetName = pn;
    }
    return (
      <div className={className}>
        <div col-m-6>
          <label>{this.props.label}</label>
          <p key='packetDetail'>{this.packetValues[packetName]}</p>
        </div>
        <div col-m-6>
          <label>{this.props.label}</label>
          <p key='packetDetail'>{this.packetValues[packetName]}</p>
        </div>
      </div>

    );
  }
}

export default FuselageDisplay;
