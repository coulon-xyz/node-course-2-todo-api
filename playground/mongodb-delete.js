// const MongoClient = require('mongodb').MongoClient is the same as const {MongoClient} = require('mongodb');
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log("Unable to connect to the MongoDb Server");
  }
  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Todos').deleteMany({"test" : "Eat lunch"}).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   console.log('error' ,err);
  // });

  //deleteOne
  // db.collection('Todos').deleteOne({"test" : "Eat lunch"}).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   console.log('error' ,err);
  // });


  // //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result)
  // });

  db.collection('Users').deleteMany({"name" : "Julien"}).then((res) => {
    console.log(res);
  });
  db.collection('Users').findOneAndDelete({_id : new ObjectID('5824b2a62d8d3e6faf6a5c7e')}).then((res) => {
    console.log(res);
  })


  // db.close();
});
