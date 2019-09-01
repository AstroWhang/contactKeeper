const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
  // each user will have their own list of contacts, not a shared contact list
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  type: {
    type: String,
    default: 'personal'
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('contact', ContactSchema);