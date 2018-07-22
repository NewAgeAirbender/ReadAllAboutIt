var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new NoteSchema object
var CommentSchema = new Schema({
  title: String,
  body: String
});

// Creates the model
var Comment = mongoose.model("Comment", CommentSchema);

// Exports
module.exports = Comment;