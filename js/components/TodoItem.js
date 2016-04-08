import React from 'react';
import Relay from 'react-relay';
import Moment from 'moment';
import UserAvatar from './UserAvatar';

export default class TodoItem extends React.Component {
  _deleteTodo = () => {
    this.props.deleteTodo(this.props.todo.id);
  };

  _editTodo = () => {
    // TODO: EditTodoMutation
  };

  render() {
    const date = Moment(this.props.todo.time).format('DD/MM/YYYY HH:mm');
    return (
      <li className="col-xs-12 todo-item">
        <div className="row">
          <UserAvatar user={this.props.user}/>
          <div className="col-xs-10 text-right content">
            <p>{this.props.todo.content}</p>
            <a onClick={this._editTodo} className="todo-item-edit text-info">edit</a>
            <a onClick={this._deleteTodo} className="todo-item-delete text-danger">delete</a>
          </div>
          <small className="col-xs-10 col-xs-offset-2 text-right">{date}</small>
        </div>
      </li>
    )
  }
}