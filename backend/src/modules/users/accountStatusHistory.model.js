const mongoose = require('mongoose');
const schema = new mongoose.Schema({ userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}, previousStatus:String, newStatus:{type:String,required:true}, reason:{type:String,default:''}, changedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true} },{timestamps:{createdAt:true,updatedAt:false}});
module.exports = mongoose.models.AccountStatusHistory || mongoose.model('AccountStatusHistory',schema);
