const  mongoose  = require("mongoose");
 const UserSchema= new mongoose.Schema({
    
    username: {
        type: String,

      },
   

        email: {type:String,
            required:true,
            unique:true,
            match : [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'please type a valid email']
        },



      
      password: {
        type: String,
      
      },

   


        
})

module.exports = mongoose.model("user", UserSchema )





 
