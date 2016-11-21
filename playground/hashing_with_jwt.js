const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


//
// var data = {
//   id: 10,
//   username: 'Roberto'
// };
//
// var token = jwt.sign(data, '123abc');   // get data and salt and return token
//
// console.log(token)
//
//
// var decoded = jwt.verify(token, '123abc');
//
// console.log('decoded: ', decoded);


// Playing with bcryptjs
var password = '123abc';

// genSalt (number of rounds, callback)
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//       console.log(hash);
//   });
// });

// when someone logs in

var hashedPassword = '$2a$10$kY5Pqt1whJ72P6U2holOuemjOGInCZctruQnYY74AGuRv.hI/YU.q';
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
})
