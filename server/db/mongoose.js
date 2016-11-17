var mongoose = require('mongoose');
mongoose.Promise = global.Promise; // telling mongoose to use build in promises and not a third party framework

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'); 

module.exports = {mongoose};
