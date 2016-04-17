import Relay from 'react-relay';

export default class EditTodoMutation extends Relay.Mutation {
  // Link the Relay.Mutation with the GraphQL mutation
  getMutation() {
    return Relay.QL`mutation {editTodo}`
  }

  // Prepare the variables to be sent as "inputFields" to the mutation
  getVariables() {
    return {
      todoId: this.props.todoId,
      user: this.props.user.id,
      content: this.props.content
    }
  }

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        name,
        avatar,
        todos(userId: 1) {
          edges
        },
      }
    `
  };

  // Specify the fields that might need updating once we get the payload
  // 'AddTodoPayload' is a generated, conventional name
  getFatQuery() {
    return Relay.QL`
      fragment on EditTodoPayload @relay(pattern: true) {
        changedUser {
          id,
          todos {
            edges {
              node {
                content,
                time,
                id
              }
            }
          }
        }
      }
    `
  }

  // configure the way relay maps the return values of the query
  // using FIELDS_CHANGE instead of RANGE_ADD for now because we're returning the whole user
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        changedUser: this.props.user.id
      }
    }]
  }

  getOptimisticResponse() {
    return {
      changedUser: this.props.user
    };
  }
}