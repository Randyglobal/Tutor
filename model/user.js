const mongoose = require('mongoose');

// schema defines the structure and property in the documents collection
const userSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      created: {
        type: Date,
        required: true,
        default: Date.now,
      },
});

module.exports = mongoose.model('Admin', userSchema)
