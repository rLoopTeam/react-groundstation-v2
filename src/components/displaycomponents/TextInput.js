import React, {Component} from 'react';

class TextInput extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: props.value
    };
  }
  render () {
    return (
      <span>
        <label>{this.props.label}</label>
        <input type="text"
               placeholder={this.props.placeHolder}
               className="form-control"
               value={this.state.value}
               onChange={this.props.onChange}
               onBlur={this.props.onBlur} />
      </span>
    );
  }
}

export default TextInput;
