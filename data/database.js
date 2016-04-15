/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
class TodoItem {}
class User {}

// mock data
const todoItems = [];
const users = [];
let todoId = 1;

const newUser = new User();
// a mock user
newUser.id = 1;
newUser.name = 'Claire Fritz';
newUser.avatar = '';
newUser.todos = [];
users.push(newUser);

function getUser(id) {
  return users.find((user)=> user.id == id);
}

// some mock data
addTodo(1, 'Learn Relay');
addTodo(1, 'Add more to-dos');
addTodo(1, 'Finish the app');

function addTodo(userId, content) {
  let todoItem = new TodoItem();
  todoItem.id = todoId++;
  todoItem.content = content;
  todoItem.time = new Date().toISOString();
  todoItems.push(todoItem);
  users.find((user) => {
    if (user.id == userId) user.todos.push(todoItem.id)
  });
  return todoItem.id;
}

function getTodo(id) {
  return todoItems.find((todo) => todo.id === id);
}
function editTodo(id, content) {
  //TODO: get the todo + replace its content + (eventually update the timestamp)
}
function deleteTodo(id, userId) {
  delete todoItems[id];
  let user = getUser(userId);
  return user.todos.splice(user.todos.indexOf(id), 1);
}
function getTodosByUser(id) {
  let user = getUser(id);
  return todoItems.filter((item)=> {
    return user.todos.find((id)=> id === item.id)
  });
}

module.exports = {
  User: User,
  TodoItem: TodoItem,
  addTodo: addTodo,
  editTodo: editTodo,
  deleteTodo: deleteTodo,
  getTodosByUser: getTodosByUser,
  getUser: getUser,
  getTodo: getTodo
};