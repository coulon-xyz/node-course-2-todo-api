const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

 // Todo.remove({}).then((result) => {
 //   console.log(result);
 // })

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

// Todo.findOneAndRemove({_id: '582da79f8dea72a081af3b6a'}).then(todo)=>{});

Todo.findByIdAndRemove('582da79f8dea72a081af3b6a').then((todo) => {
  console.log(todo);
});
