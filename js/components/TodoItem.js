import React from 'react';
import Relay from 'react-relay';
import Moment from 'moment';
import UserAvatar from './UserAvatar';
import TodoInput from './TodoInput';

export default class TodoItem extends React.Component {
  state = {
    editing: false
  };

  _deleteTodo = () => {
    this.props.deleteTodo(this.props.todo.id);
  };

  _editTodo = () => {
    this.setState({editing: true});
  };

  _submitTodo = (value) => {
    this.props.editTodo(this.props.todo.id, value);
  };

  _onBlur = () => {
    this.setState({editing: false});
  };

  _renderInputField = () => {
    return (<TodoInput content={this.props.todo.content} submitTodo={this._submitTodo} onBlur={this._onBlur} layout="edit"/>);
  };

  render() {
    const date = Moment(this.props.todo.time).format('DD/MM/YYYY HH:mm');
    return (
      <li className="col-xs-12 todo-item">
        <div className="row">
          <UserAvatar user={this.props.user}/>
          <div className="col-xs-10 text-right content">
            {this.state.editing && this._renderInputField() || this.props.todo.content}
            <a onClick={this._editTodo} className="todo-item-edit text-info"><span className="glyphicon glyphicon-pencil"/>edit</a>
            <a onClick={this._deleteTodo} className="todo-item-delete text-danger"><span className="glyphicon glyphicon-trash"/>delete</a>
          </div>
          <small className="col-xs-10 col-xs-offset-2 text-right">{date}</small>
        </div>
      </li>
    )
  }
}