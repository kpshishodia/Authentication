


const getProfileController = async (req,res) => {

    try{

        // 1 . get user from req via using verifyJWT middleware 

        const user = req.user

        if(!user){
            return res.status(400).json({
              message: "Bad request",
              error: error.message,
            })
        }
        
        // 2 . return respone with user body

        return res.status(200).json({
            message: "Profile Successfully fetched.",
            user
        })

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

export default getProfileController