var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb')

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/User');

var app = express();

//middleware is bodyParser, we can now send json to express
app.use(bodyParser.json());

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

app.get('/todos/:id', (req,res) => {
  var id = req.params.id     // id comes from :id from /todos/:id

  // check if id is valid
  if (!ObjectID.isValid(id)) {
    res.status(400).send({error: 'invalid ID format'});
  };

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send({error: 'ID not found'});
    }
    res.send({todo});
  }).catch((e) => res.status(400).send(e)
    );
})

app.listen(3000 , () => {
  console.log("Server started on port 3000")
});


module.exports = {app};
