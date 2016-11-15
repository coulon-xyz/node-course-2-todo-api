const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todosLength;

beforeEach((done) => {
  Todo.find().then((todos) => {
    todosLength = todos.length
    done()
  })
})

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

    Todo.find().then((todos) => {
      expect(todos.length).toBe(todosLength + 1);
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
      expect(todos.length).toBe(todosLength);
      done()
    }).catch((e) => done(e));
    });
  });

});
