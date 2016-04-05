import React from 'react';
import Relay from 'react-relay';

export default class TodoItem extends React.Component {
  render() {
    return (
      <span>{this.props.todo.content}</span>
    )
  }
}

/*export default Relay.createContainer(TodoItem, {
  fragments: {
    todo: () => Relay.QL`
      fragment on TodoItem {
        id,
        content,
        time
      }
    `
  }
});*/