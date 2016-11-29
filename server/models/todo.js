var mongoose = require('mongoose');

var Todo = mongoose.model('todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true      // trim will remove any leading and trailing spaces.
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Todo};
