import React from 'react';
import Relay from 'react-relay';
import TodoItem from './TodoItem';
import TodoCount from './TodoCount';
import TodoInput from './TodoInput';
import AddTodoMutation from '../mutations/AddTodoMutation';
import EditTodoMutation from '../mutations/EditTodoMutation';
import DeleteTodoMutation from '../mutations/DeleteTodoMutation';


class App extends React.Component {
  componentDidMount = ()=> {
    // TODO: insert DOM manipulation through a helper, maybe linked with an event system like postal.js
  };
  _handleChange = (e) => {
    if (e.keyCode === 13) this._submitTodo(e.target.value);
  };
  _submitTodo = (value) => {
    Relay.Store.commitUpdate(new AddTodoMutation({
      user: this.props.user,
      content: value
    }));
  };
  _deleteTodo = (todoId) => {
    Relay.Store.commitUpdate(new DeleteTodoMutation({
      itemId: todoId,
      user: this.props.user
    }));
  };
  _editTodo = (todoId, content) => {
    Relay.Store.commitUpdate(new EditTodoMutation({
      todoId: todoId,
      user: this.props.user,
      content: content
    }));
  };
  render() {
    return (
      <div className="row app">
        <div className="col-xs-12">
          <TodoCount count={this.props.user.todos.edges.length}/>
          <ul className="row todo-list">
            {this.props.user.todos.edges.map(({node}) =>
              <TodoItem key={node.id} todo={node} user={this.props.user} deleteTodo={this._deleteTodo} editTodo={this._editTodo}/>
            )}
          </ul>
          <div className="container">
            <TodoInput submitTodo={this._submitTodo} layout="bottom"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    userId: 1
  },
  fragments: {
    user: (variables) => Relay.QL`
      fragment on User {
        id,
        name,
        avatar,
        todos(userId: $userId) {
          edges {
            node {
              id,
              content,
              time,
            },
          },
        },
        ${AddTodoMutation.getFragment('user')},
        ${DeleteTodoMutation.getFragment('user')},
        ${EditTodoMutation.getFragment('user')}
      }
    `
  }
});

