import React from 'react';

export default class TodoInput extends React.Component {
  static propTypes = {
    submitTodo: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func,
    content: React.PropTypes.string,
    layout: React.PropTypes.string
  };

  state = {
    text: this.props.content || ''
  };

  _handleChange = (e)=> {
    this.setState({text: e.target.value});
  };

  _handleKeyDown = (e)=> {
    if (e.keyCode === 13) {
      this.props.submitTodo(this.state.text);
      this.setState({text: ''}, (()=> {
        if (this.props.layout === 'edit') this.refs.inputField.blur()
      }));
    }
  };

  // TODO: place the cursor at the end of the value
  render() {
    return (
      <div className={'todo-input ' + this.props.layout}>
        <input
          className="form-control"
          placeholder="Enter your message..."
          ref="inputField"
          value={this.state.text}
          onChange={this._handleChange}
          onKeyDown={this._handleKeyDown}
          onBlur={this.props.onBlur}
          autoFocus
        />
      </div>
    )
  }
}