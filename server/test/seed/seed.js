const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID;
const userTwoId = new ObjectID;

const users = [{
  _id: userOneId,
  email: 'julien@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
},{
  _id: userTwoId,
  email: 'julien2@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId
},{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 666,
  _creator: userTwoId
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    // by running save, we are going to go thru the middleware (hashing password)
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    // and by using Promise.all, we are going to wait for save to finish before moving on
    return Promise.all([userOne, userTwo])

  }).then(() => done());
};




module.exports = {todos, users, populateTodos, populateUsers};
