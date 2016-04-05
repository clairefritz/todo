/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
/*class User {}
class Widget {}

// Mock data
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';
var widgets = ['What\'s-it', 'Who\'s-it', 'How\'s-it'].map((name, i) => {
  var widget = new Widget();
  widget.name = name;
  widget.id = `${i}`;
  return widget;
});

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getWidget: (id) => widgets.find(w => w.id === id),
  getWidgets: () => widgets,
  User,
  Widget,
};
*/

// Model types
class TodoItem {}
class User {}

// mock data
const todoItems = [];
const users = [];
let todoId = 1;

const user = new User();
user.id = 1;
user.name = 'Claire Fritz';
user.todos = [];
users.push(user);

function getUser(id) {
  return users.find((user)=> user.id === id);
}

addTodo(1, 'Learn Relay');
addTodo(1, 'Populate the database');
addTodo(1, 'Add more to-dos');

function addTodo(userId, content) {
  const todoItem = new TodoItem();
  todoItem.id = todoId++;
  todoItem.content = content;
  todoItem.time = new Date();
  todoItems.push(todoItem);
  users.find((user) => {
    if (user.id == userId) user.todos.push(todoItem.id)
  });
  return todoItem.id;
}

function getTodo(id) {
  return todoItems.find((todo) => todo.id === id);
}
function editTodo(id, content) {}
function deleteTodo(id) {}
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