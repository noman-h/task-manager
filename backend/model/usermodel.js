const mongoose=require('mongoose')

const userSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
           type:String,
            required:true,
            unique:true   
        },
        phone:{
            type:Number,
            required:true
        },
        role:{
           type:String,
           default:'user' 
        },
        password:{
             type:String,
            required:function (){
                return this.authtype==='local'
            }
        },
        authtype:{
             type:String,
             enum:["google","local"],
             default:"local"    
        },
        theme:{
            type:String,
            default:"light"
        },
        otp:{
            type:Number,
            default:0
        },
        expiretime:{
            type:Date
        }
    }
)

module.exports=mongoose.models.users || mongoose.model("users", userSchema)