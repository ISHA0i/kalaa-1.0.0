const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

NoteSchema.index({ user: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Note', NoteSchema);