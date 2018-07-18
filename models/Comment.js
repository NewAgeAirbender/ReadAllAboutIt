var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new NoteSchema object
var CardSchema = new Schema({
  title: String,
  body: String,
  author: String
});

// Creates the model
var Note = mongoose.model("Card", CardSchema);

// Exports
module.exports = Note;