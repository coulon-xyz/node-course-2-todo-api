const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
      unique: true, // check if there is an other document with the same value in the collection
      validate: {
        validator: validator.isEmail,
        message:'{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      require: true,
      minlength: 6
    },
    tokens: [{
        access: {
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
    }]
});

// Override toJSON method to make sure we don't send back sensitive information.
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}


UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return new Promise((resolve, reject) => {
      reject();
    }) // return Promise.reject() also work
  }

  var searchObject = {
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  }

return User.findOne(searchObject);

};

// mongoose middleware
UserSchema.pre('save', function (next) {
  var user = this;
  // if statement to prevent password to be hashed multiple time
  if (user.isModified('password')) {
    //genSalt (number of rounds, callback)
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
      });
    });
  } else {
    next();
  }
})

var User = mongoose.model('user', UserSchema);

module.exports = {User}
