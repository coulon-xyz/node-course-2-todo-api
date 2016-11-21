const jwt = require('jsonwebtoken')

var data = {
  id: 10,
  username: 'Roberto'
};

var token = jwt.sign(data, '123abc');   // get data and salt and return token

console.log(token)


var decoded = jwt.verify(token, '123abc');

console.log('decoded: ', decoded);
