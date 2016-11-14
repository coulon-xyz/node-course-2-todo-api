// const MongoClient = require('mongodb').MongoClient is the same as const {MongoClient} = require('mongodb');
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log("Unable to connect to the MongoDb Server");
  }
  console.log('Connected to MongoDB server');

  //findOneAndUpdate(filter, update, options, callback) -> {Promise}
  db.collection('Todos').findOneAndUpdate(
    { _id: new ObjectID('5825ba73d15ad6a4cdf85657') },
    { $set: { completed: true } },
    { returnOriginal: false}
    ).then((result) => {
      console.log(result);
      });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('58249fe95042485b93a4b5fe')
  },{
    $set: { name: 'Julien' },
    $inc: {age : 1 }
  },{
    returnOriginal: false
  }).then((results) => {
    console.log(results);
  });




  // db.close();
});
