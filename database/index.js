var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var schemaObj = {
  id: {type: Number, unique: true},
  firstName: String, 
  lastName: String
};

console.log("SCHEMA", schemaObj);
var nameSchema = mongoose.Schema(schemaObj);
var Name = mongoose.model('name', nameSchema);  

var someName = new Name({id: 1, firstName: 'John', lastName:'Wall'})
someName.save((err, someName) => {});

module.exports = Name;