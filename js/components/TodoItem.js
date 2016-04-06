import React from 'react';
import Relay from 'react-relay';
import Moment from 'moment';
import UserAvatar from './UserAvatar';
import DeleteTodoMutation from '../mutations/DeleteTodoMutation';
import AddTodoMutation from '../mutations/AddTodoMutation';

export default class TodoItem extends React.Component {
  _deleteTodo = () => {
    Relay.Store.commitUpdate(new DeleteTodoMutation({
      id: this.props.todo.id,
      userId: this.props.user.id
    }))
  };

  render() {
    const date = Moment(this.props.todo.time).format('DD/MM/YYYY HH:mm');
    return (
      <li>
        <UserAvatar user={this.props.user}/>
        <div>
          {this.props.todo.content}
        </div>
        <p>{date}</p>
        <a onClick={this._deleteTodo}>delete me!!</a>
      </li>
    )
  }
}