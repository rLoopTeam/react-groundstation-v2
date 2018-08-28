import React from 'react';
import GenericParameterDisplay from './GenericParameterDisplay.js';
import './ConnectionStatusDisplay.css';

class AiCommandDisplay extends GenericParameterDisplay {
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

    this.commandlist = ['STREAM_ACCEL_ON',
      'STREAM_ACCEL_OFF',
      'STREAM_LASER_FWD_ON',
      'STREAM_LASER_FWD_OFF',
      'COMMAND 5',
      'COMMAND 6',
      'COMMAND 7',
      'COMMAND 8',
      'COMMAND 9'
    ];
  }

  getFormattedValue () {
    let val = Math.trunc(this.state.value);
    let formattedValue = 'None';
    if (this.state.stale === true) {
      formattedValue = 'None';
    } else {
      formattedValue = this.commandlist[val];
    }
   /*
   formattedValue = this.commandlist[val];
  */
    return formattedValue;
  }

  render () {
    const value = this.getFormattedValue();
    return (
      <div>
        <span><input type="text" className="form-control" value={value} readOnly={this.isReadOnly()} /></span>
      </div>
    );
  }
}

export default AiCommandDisplay;
