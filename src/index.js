const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find( user =>  user.username === username);
  
  if(user){
    request.user = user
    return next();
  }

  return response.status(400).json({messagem: "Usuário não encontrado"});
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const id = uuidv4();
  
  userAlreadyExist = users.some(u => {
    return u.username == username;
  })

  if(userAlreadyExist){
    return response.status(400).json({error: "Username já existe, por favor escolha outro!"});
  }

  user = {
    id,
    name,
    username,
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(u => {
    return u.username == username;
  });

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body;
  const { user } = request;

  const todo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
    }

    user.todos.push(todo);

    return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline} = request.body;
  
  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(404).json({error: "Tarefa não encotnrada"});
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find(todo => todo.id === id);
  
  if(!todo){
    return response.status(404).json({error: "Tarefa não encontrada!"});
  }

  todo.done = !todo.done;
  
  return response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(user => user.id === id);

  if(!todo){
    return response.status(404).json({error: "Tarefa não encontrada!"});
  }
  
  const indexArr = user.todos.indexOf(todo);
  user.todos.splice(indexArr, 1);

  return response.status(204).send();
});

module.exports = app;