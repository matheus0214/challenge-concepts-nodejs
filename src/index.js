const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const checkUserExist = users.find((user) => user.username === username);

  if (!checkUserExist)
    return response.status(400).json({
      error: "User does not found",
    });

  request.user = checkUserExist;

  return next();
}

function checkTodoExist(request, response, next) {
  const { id } = request.params;
  const { user } = request;

  const checkExistTodo = user.todos.find((todo) => todo.id === id);

  if (!checkExistTodo)
    return response.status(404).json({
      error: "Todo does not found",
    });

  request.todo = checkExistTodo;

  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const checkUsernameInUse = users.some((user) => user.username === username);

  if (checkUsernameInUse)
    return response.status(400).json({
      error: "Username already in use",
    });

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put(
  "/todos/:id",
  checksExistsUserAccount,
  checkTodoExist,
  (request, response) => {
    // Complete aqui
    const { title, deadline } = request.body;
    const { todo } = request;

    Object.assign(todo, {
      title: title || todo.title,
      deadline: deadline ? new Date(deadline) : todo.deadline,
    });

    return response.json(todo);
  }
);

app.patch(
  "/todos/:id/done",
  checksExistsUserAccount,
  checkTodoExist,
  (request, response) => {
    // Complete aqui
    const { todo } = request;

    todo.done = true;

    return response.json(todo);
  }
);

app.delete(
  "/todos/:id",
  checksExistsUserAccount,
  checkTodoExist,
  (request, response) => {
    // Complete aqui
    const { todo, user } = request;

    user.todos.splice(todo, 1);

    return response.status(204).send();
  }
);

module.exports = app;
