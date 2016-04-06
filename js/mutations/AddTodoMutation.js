import Relay from 'react-relay';

export default class AddTodoMutation extends Relay.Mutation {
  // Link the Relay.Mutation with the GraphQL mutation
  getMutation() {
    return Relay.QL`mutation {addTodo}`
  }

  // Prepare the variables to be sent as "inputFields" to the mutation
  getVariables() {
    return {
      userId: this.props.userId,
      content: this.props.content
    }
  }

  static fragments = {
    user: () => {
      return Relay.QL`fragment on User {
        id,
        name,
        todos {
          edges
        }
      }
    `}
  };

  // Specify the fields that might need updating once we get the payload
  // 'AddTodoPayload' is a generated, conventional name
  getFatQuery() {
    return Relay.QL`
      fragment on AddTodoPayload @relay(pattern: true) {
        newTodoEdge,
        user {
          id,
          name,
          todos {
            edges {
              node
            }
          }
        },
      }
    `
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.userId,
      connectionName: 'TodoItemConnection',
      edgeName: 'newTodoEdge',
      rangeBehaviors: {
        '': 'append'
      }
    }]
  }

  getOptimisticResponse() {
    return {
      newTodoEdge: {
        node: {
          content: this.props.content
        }
      },
      user: {
        id: this.props.userId
      }
    };
  }
}