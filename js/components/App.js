import React from 'react';
import Relay from 'react-relay';
import TodoItem from './TodoItem';
import TodoCount from './TodoCount';
import TodoInput from './TodoInput';
import AddTodoMutation from '../mutations/AddTodoMutation';

class App extends React.Component {
  _handleChange = (e) => {
    if (e.keyCode === 13) this._submitTodo(e.target.value);
  };
  _submitTodo = (value) => {
    Relay.Store.commitUpdate(new AddTodoMutation({
      userId: this.props.user.id,
      content: value
    }), {onSuccess: (function(success){
      console.log('success', success);
    }), onFailure: (function(failure){
      console.log('failure', failure);
    })});
    this.props.relay.setVariables({newTodo: true});
  };
  render() {
    return (
      <div>
        <h1>To-do list</h1>
        <TodoCount count={this.props.user.todos.edges.length}/>
        <ul>
          {this.props.user.todos.edges.map(({node}) =>
            <li key={node.id}><TodoItem todo={node}/></li>
          )}
        </ul>
        <TodoInput handleChange={this._handleChange}/>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    userId: 1,
    newTodo: false
  },
  fragments: {
    user: (variables) => Relay.QL`
      fragment on User {
        id,
        todos(userId: $userId) {
          edges {
            node {
              id,
              content,
              time,
            },
          },
        },
      }
    `,
  },
}); //         ${AddTodoMutation.getFragment('user').if(variables.newTodo)}

