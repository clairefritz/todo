import React from 'react';

export default class TodoInput extends React.Component {
  static propTypes = {
    handleChange: React.PropTypes.func.isRequired
  };
  // TODO: empty the field once a todo has been submitted
  render() {
    return (
      <div className="todo-input container">
        <input placeholder="Enter your message..." onKeyDown={this.props.handleChange} className="form-control" autoFocus/>
      </div>
    )
  }
}