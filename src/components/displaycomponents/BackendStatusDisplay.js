import React from 'react';
import GenericParameterDisplay from './GenericParameterDisplay.js';
import './ConnectionStatusDisplay.css';

class BackendStatusDisplay extends GenericParameterDisplay {
  constructor (props) {
    super(props);
    this.styles = {
      default: {
        color: 'black'
      },
      nominal: {
        color: 'green'
      },
      warning: {
        color: 'red',
        fontWeight: 800
      }
    };
  }

  getFormattedValue () {
    let val = Boolean(this.state.value);
    let formattedValue = 'Offline';
    if (this.state.stale === true) {
      formattedValue = 'Offline';
    } else {
      switch (val) {
        case false: formattedValue = 'Offline';
          break;
        case true: formattedValue = 'Running';
          break;
        default: formattedValue = 'Offline';
      }
    }
    return formattedValue;
  }

  render () {
    const value = this.getFormattedValue();
    let valueStyling = this.styles.default;
    let titleString = '';
    if (this.props.minValue || this.props.maxValue) {
      valueStyling = (value > this.props.maxValue) ? this.styles.warning : this.styles.nominal;
      titleString = 'Min: ' + this.props.minValue + ', Max: ' + this.props.maxValue;
    }
    return (
      <div className="Connection-status-display">
        <div className={'dot ' + value}></div>
        <div className={'statusText'}><span style={valueStyling} title={titleString}>{value}</span></div>
      </div>
    );
  }
}

export default BackendStatusDisplay;

