const mongoose=require('mongoose')

const deviceschema=mongoose.Schema({
    user:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'users',
     required:true
    },
    hostname:String,
    platform:String,
    arch:String,
    ostype:String
},
{
    timestamps:true
}
)

module.exports=mongoose.model('devices',deviceschema)