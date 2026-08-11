const mongoose = require('mongoose');
const schema = new mongoose.Schema({ userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}, tokenHash:{type:String,required:true}, userAgent:{type:String,default:''}, ipAddress:{type:String,default:''}, lastUsedAt:{type:Date,default:Date.now}, expiresAt:{type:Date,required:true,index:{expires:0}}, revokedAt:{type:Date,default:null}, revokeReason:{type:String,default:''} },{timestamps:true});
module.exports=mongoose.models.AuthSession||mongoose.model('AuthSession',schema);
