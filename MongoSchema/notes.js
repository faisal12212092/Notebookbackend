const mongoose=require('mongoose');
const user = require('./user');
const noteschema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:user
        },
        title:{
            type:String,
            required:true,
        },
        tag:{
            type:String,
            default:"General"
        },

        description:{
            type:String,
            required:true,
        },
        date:{
            type:Date,
            default:Date.now
        }

    }
);
module.exports=mongoose.model("NOte",noteschema);