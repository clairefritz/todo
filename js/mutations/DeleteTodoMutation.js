import Relay from 'react-relay';

export default class DeleteTodoMutation extends Relay.Mutation {
  // Prepare the variables to be sent as "inputFields" to the mutation
  getVariables() {
    return {
      itemId: this.props.itemId,
      user: this.props.user.id
    }
  }

  // Link the Relay.Mutation with the GraphQL mutation
  getMutation() {
    return Relay.QL`mutation {deleteTodo}`
  }

  // this passes the variables to the mutation, any needed field should be listed
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        todos(userId: 1) {
          edges
        }
      }
    `
  };

  // Specify the fields that might need updating once we get the payload
  // 'DeleteTodoPayload' is a generated, conventional name
  // user = outputFields.user from DeleteTodoMutation
  // @relay(pattern: true): match the fat query pattern against the tracked query
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteTodoPayload @relay(pattern: true) {
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