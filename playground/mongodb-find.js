// const MongoClient = require('mongodb').MongoClient is the same as const {MongoClient} = require('mongodb');
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log("Unable to connect to the MongoDb Server");
  }
  console.log('Connected to MongoDB server');

  // // find() returns a pointer to the documents // toArray returns a promise
  // db.collection('Todos').find({_id: new ObjectID('5825a825d15ad6a4cdf85652')}).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to reach Todos', err)
  // });

  // // find() returns a pointer to the documents // toArray returns a promise
  // db.collection('Todos').find().count().then((count) => {
  //   console.log('Todos count: ', count);
  //
  // }, (err) => {
  //   console.log('Unable to reach Todos', err)
  // });

  db.collection('Users').find({name: "Julien"}).count().then((count) => {
      console.log('Users Julien count: ', count);
  }, (err) => {
    console.log('Cannot connect to Users: ', err)
  })



  // db.close();
});
