var mongoose = require('mongoose');
var {DateTime} = require('luxon');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  title:{type:String, required:true, minlength:1, maxlength:45},
  message:{type:String, required:true, maxlength:1500},
  timestamp: {type:Date, required:true, default:Date.now()},
  user: {type: Schema.Types.ObjectId, ref:"User", required:true}
});


MessageSchema
.virtual('date')
.get(function(){
  let date = DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
  return date;
})


module.exports = mongoose.model("Message", MessageSchema)
