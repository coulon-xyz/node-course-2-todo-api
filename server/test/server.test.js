const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user')
const {todos, users, populateTodos, populateUsers} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test to do text';

  request(app)
  .post('/todos')
  .send({text})
  .expect(200)
  .expect((res) => {
    expect(res.body.text).toBe(text);
  })
  .end((err, res) => {
    if (err) {
      return done(err);
    }

    Todo.find({text}).then((todos) => {
      expect(todos.length).toBe(1);
      expect(todos[0].text).toBe(text);
      done();
    }).catch((e) => done(e));
  });

  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({text: " "})
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

    Todo.find().then((todos) => {
      expect(todos.length).toBe(2);
      done()
    }).catch((e) => done(e));
    });
  });

});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
     .get('/todos')
     .expect(200)
     .expect((res) => {
       expect(res.body.todos.length).toBe(2)
     })
     .end(done);
  })
})

describe('GET /todo/:id', () => {
  it('should return todo doc', (done)=> {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)  //toHexString to convert to string
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should a 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
    });

  it('should return 404 for non-objectId', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err,res) => {
        // calling end with a callback so we can do async checks (item removed from db ?)
        if (err) {
          return done(err);
        }
        //query db using find by id using toNotExist assertion.
        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });

  });

  it('should return a 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if objectid is invalid', (done) => {
  request(app)
    .delete('/todos/123abc')
    .expect(404)
    .end(done);
  });
});


describe('PATCH /todo/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var patchObj =  {
      text : "Patching object number 1",
      completed : true
    };
    request(app)
      .patch(`/todos/${hexId}`)
      .send(patchObj)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(patchObj.text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end((err,res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo.text).toBe(patchObj.text);
          expect(todo.completed).toBe(true);
          expect(todo.completedAt).toBeA('number');
          done();
        }).catch((e) => done(e))
      });
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var patchObj =  {
      text : "Patching object number 2",
      completed : false
    };
    request(app)
      .patch(`/todos/${hexId}`)
      .send(patchObj)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(patchObj.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist;
      })
      .end((err,res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo.text).toBe(patchObj.text);
          expect(todo.completed).toBe(false);
          expect(todo.completedAt).toNotExist;
          done();

      }).catch((e) => done(e))
    });
  });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
          .get('/users/me')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
          })
          .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
      request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
    });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = 'AZEmnp§';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password); // check that pass has been hashed
          done();
        });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'wrongemail_format.com';
    var password ='sh';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .expect((res) =>{
        expect(res.body.message).toBe("user validation failed")
        expect(res.body.name).toBe("ValidationError")
      })
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = users[0].email;
    var password = 'longpassword';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);
  });
});
