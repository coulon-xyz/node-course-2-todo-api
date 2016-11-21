require('./config/config')

const _ = require('lodash')
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb')

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000

//middleware is bodyParser, we can now send json to express
app.use(bodyParser.json());

// ROUTE /todos

app.post('/todos',(req,res) => {
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  } )
});

app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.stats(400).send(e);
  });
});

// ROUTE /todos/:id

app.get('/todos/:id', (req,res) => {
  var id = req.params.id     // id comes from :id from /todos/:id

  // check if id is valid
  if (!ObjectID.isValid(id)) {
    res.status(404).send({error: 'invalid ID format'});
  };

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send({error: 'ID not found'});
    }
    res.send({todo});
  }).catch((e) => res.status(404).send(e));
});

app.delete('/todos/:id', (req,res) => {
  // get the id
  var id = req.params.id
  // check if id is valid
  if (!ObjectID.isValid(id)) {
    res.status(404).send({error: 'invalid ID format'});
  }
  // remove todo by id
  Todo.findByIdAndRemove(id).then((todo) => {
    // Success : if no doc 404, if doc send doc back with 200
    if (!todo) {
      return res.status(404).send({error: 'ID not found'});
    }
    res.send({todo});
  }).catch((e) => res.status(404).send(e));
});

app.patch('/todos/:id', (req, res) => {

  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    res.status(404).send({error: 'invalid ID format'});
  };

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});

  }).catch((e) => {
    res.status(400).send();
  });
});

// ROUTE /user

app.post('/users',(req,res) => {

  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then((user) => {
    console.log("HELLO: ", user)

    return user.generateAuthToken();
  }).then((token) => {
    console.log("shello 3")
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});



app.listen(port , () => {
  console.log(`Server started on port ${port}`)
});

module.exports = {app};
