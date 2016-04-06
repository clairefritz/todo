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
    avatar: {
      type: GraphQLString,
      description: 'Avatar path'
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
    },
    todo: {
      type: todoType,
      resolve: () => getTodosByUser(1)
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
        const newTodo = getTodo(localTodoId);
        return {
          cursor: cursorForObjectInConnection(getTodosByUser(userId), newTodo),
          node: newTodo
        }
      }
    },
    user: {
      type: userType,
      resolve: ({userId}) => getUser(userId)
    }
  },
  mutateAndGetPayload: ({userId, content}) => {
    const localTodoId = addTodo(fromGlobalId(userId).id, content);
    return {localTodoId, userId};
  }
});

const DeleteTodoMutation = mutationWithClientMutationId({
  name: 'DeleteTodo',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    userId: {type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    deletedTodoId: {
      type: GraphQLID,
      resolve: ({id, userId}) => getUser(userId)
    },
    user: {
      type: userType,
      resolve: ({userId}) => getUser(userId)
    }
  },
  mutateAndGetPayload: ({id, userId}) => {
    const localTodoId = fromGlobalId(id).id;
    deleteTodo(localTodoId);
    return {id, userId};
  }
});

const EditTodoMutation = mutationWithClientMutationId({
  name: 'EditTodo'
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
