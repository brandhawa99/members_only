var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type:String, required:true, minlength:1},
  password:{type:String, required:true},
  admin: {type:Boolean, default:false},
  top_user:{type:Boolean, default:false}
});

module.exports = mongoose.model('User',UserSchema);
