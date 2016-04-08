/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  TodoItem,
  addTodo,
  editTodo,
  deleteTodo,
  getTodosByUser,
  getUser,
  getTodo
} from './database';

import {
  createInputObject
} from './helpers'

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */


var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') return getUser(id);
    else if (type === 'TodoItem') return getTodosByUser(id);
  },
  (obj) => {
    return obj.todos ? userType : todoType;
  }
);


/**
 * type definitions
 */


var todoType = new GraphQLObjectType({
  name: 'TodoItem',
  description: 'A to-do item',
  isTypeOf: (obj) => obj instanceof TodoItem,
  fields: () => ({
    id: globalIdField('TodoItem'),
    content: {
      type: GraphQLString,
      description: 'The to-do text'
    },
    time: {
      type: GraphQLString,
      description: 'Time and date of submission'
    }
  }),
  interfaces: [nodeInterface]
});


/**
 * Connection definition
 */
var {connectionType: todoConnection,
  edgeType: TodoEdge} =
  connectionDefinitions({nodeType: todoType});

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  isTypeOf: (obj) => obj instanceof User,
  fields: () => ({
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
      description: 'The name of the user'
    },
    avatar: {
      type: GraphQLString,
      description: 'Avatar path'
    },
    todos: {
      type: todoConnection,
      description: 'A person\'s collection of todos',
      args: {
          userId: { type: GraphQLInt }
        },
        ...connectionArgs,
      resolve: (user, {userId, ...args}) => connectionFromArray(getTodosByUser(userId), args)
    }
  }),
  interfaces: [nodeInterface]
});



var userInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: () => ({
    id: globalIdField('User'),
    name: {type: GraphQLString},
    avatar: {type: GraphQLString},
    todos: {
      type: createInputObject(todoType)
    }
  }),
  interfaces: [nodeInterface]
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    user: {
      type: userType,
      resolve: () => getUser(1)
    },
    todos: {
      type: todoType,
      resolve: () => getTodosByUser(1)
    }
  })
});

const AddTodoMutation = mutationWithClientMutationId({
  name: 'AddTodo',
  // incoming values
  inputFields: {
    user: {type: userInputType},
    content: {type: new GraphQLNonNull(GraphQLString)}
  },
  // outcoming values
  outputFields: {
    newTodoEdge: {
      type: TodoEdge,
      resolve: ({userId})=> getTodosByUser(userId)
    },
    user: {
      type: userType,
      resolve: ({userId}) => getUser(userId)
    }
  },
  // 1. proceed to updating the stored data
  // 2. return the payload that outputFields will need
  mutateAndGetPayload: ({user, content}) => {
    let userId = user.id;
    addTodo(fromGlobalId(userId).id, content);
    return {userId};
  }
});

const DeleteTodoMutation = mutationWithClientMutationId({
  name: 'DeleteTodo',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    user: {type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    user: {
      type: userType,
      resolve: ({userId}) => getUser(userId)
    }
  },
  mutateAndGetPayload: ({id, user}) => {
    let localTodoId = fromGlobalId(id).id;
    deleteTodo(localTodoId, user);
    return {user, localTodoId};
  }
});

// TODO: EditTodoMutation
const EditTodoMutation = mutationWithClientMutationId({
  name: 'EditTodo',
  inputFields: {},
  outputFields: {},
  mutateAndGetPayload: ()=> {}
});


/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addTodo: AddTodoMutation,
    deleteTodo: DeleteTodoMutation,
    editTodo: EditTodoMutation
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  mutation: mutationType
});
