const mongoose = require('mongoose');

const messageSchema=new mongoose.Schema({
    content:{
        type:mongoose.Schema.Types.String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    thread:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Thread'
    }
})

const Message=mongoose.model('Message',messageSchema);
module.exports=Message;