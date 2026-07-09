const mongoose=require('mongoose')

const taskSchema=mongoose.Schema(
    {
        taskname:{
            type:String,
            required:true
        },
        taskdescription:{
           type:String,
            required:true,  
        },
        taskduedate:{
            type:Date,
            required:true, 
        },
        taskactivity:{
           type:String,
            default:"pending"  
        },
         taskassignto:{
            type:mongoose.Schema.Types.ObjectId,
           ref:'users',
           required:true
        },
        taskassignby:{
           type:mongoose.Schema.Types.ObjectId,
           ref:'users',
           required:true
        },
        status:{
           type:Boolean,
           default:true 
        },
        images:String
    },{
        timestamps:true,
    versionKey:false
    }
)


module.exports=mongoose.models.tasks || mongoose.model("tasks", taskSchema)