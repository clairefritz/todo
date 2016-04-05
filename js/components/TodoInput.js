import React from 'react';

export default class TodoInput extends React.Component {
  static propTypes = {
    handleChange: React.PropTypes.func.isRequired,
  };
  render() {
    return (
      <input placeholder="Enter your message..." onKeyDown={this.props.handleChange}/>
    )
  }
}