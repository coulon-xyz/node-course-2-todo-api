const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '582b1136839e899a084fcd3d';
var userId = '5829e61e9b2bb3c5633d2ce8'

if (!ObjectID.isValid(id)) {
  console.log('ID not valid: ', id);
}

Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos);
});

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
  if (!todo) {
    return console.log('Id not found: ', id)
  }
  console.log('Todo by Id', todo);
}).catch((e) => console.log(e));

User.findById(userId).then((user) => {
  if (!user) {
    return console.log('UserId not found: ', userId);
  }
  console.log('User by Id: ', JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
