import User from "../models/user.model.js"

const registerUserController = () =>{
    try{

    }catch(error){
         // ----------------------------------------------------
    // Error handling: keeps response consistent for any unexpected failure.
    // ----------------------------------------------------

    return res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
    }
}