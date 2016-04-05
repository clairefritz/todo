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

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */


var {nodeInterface, nodeField} = nodeDefinitions((globalId) => {
  var {type, id} = fromGlobalId(globalId);
  if (type === 'User') return getUser(id);
  else if (type === 'TodoItem') return getTodosByUser(id);
});

/**
 * Define your own types here
 */

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
    todos: {
      type: todoConnection,
      description: 'A person\'s collection of todos',
      //args: connectionArgs,
      args: {
        userId: { type: GraphQLInt }
      },
      resolve: (user, args) => connectionFromArray(getTodosByUser(args.userId), args)
    }
  }),
  interfaces: [nodeInterface]
});

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
 * Define your own connection types here
 */
var {connectionType: todoConnection,
  edgeType: TodoEdge} =
  connectionDefinitions({name: 'TodoItem', nodeType: todoType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    user: {
      type: userType,
      resolve: () => getUser(1)
    }
  })
});

const AddTodoMutation = mutationWithClientMutationId({
  name: 'AddTodo',
  inputFields: {
    userId: {type: new GraphQLNonNull(GraphQLString)},
    content: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    newTodoEdge: {
      type: TodoEdge,
      resolve: ({userId, localTodoId}) => {
        console.log('outputFields.todo.resolve', localTodoId, getTodosByUser(fromGlobalId(userId)));
        const newTodo = getTodo(localTodoId);
        return {
          cursor: cursorForObjectInConnection(getTodosByUser(fromGlobalId(userId)), newTodo),
          node: newTodo
        }
      }
    },
    user: {
      type: userType,
      resolve: ({userId}) => {
        console.log('blabla user', userId);
        getUser(userId);
      }
    }
  },
  mutateAndGetPayload: ({userId, content}) => {
    const localTodoId = addTodo(fromGlobalId(userId).id, content);
    console.log(localTodoId, content, userId);
    return {localTodoId, userId};
  }
});


/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addTodo: AddTodoMutation
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
