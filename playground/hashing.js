const {SHA256} = require('crypto-js');



var message = 'I am user number 3';
var hash = SHA256(message).toString(); // result from SHA256 is an object

console.log(`message: ${message}`);
console.log(`hash: ${hash}`)

var data= {
  id: 4
};

var token = {
  data: data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString();
}

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if (resultHash === token.hash) {
  console.log('Data was not changed');
} else {
  console.log('Data was changed, do not trust');
}
