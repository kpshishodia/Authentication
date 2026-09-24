import User from "../models/user.model";

const registerUserController = async (req,res) => {

      try {
        // 1 . getting data from client
   const {userName,email,password} = req.body;

   // 2.  evalutae accepted fields
   const allowedFields = ["userName","email","password"]
   const requestFields = Object.keys(req.body)

   const isFieldsValid = requestFields.every((field) =>{
    allowedFields.includes(field)
   })

    if (!isFieldsValid) {
      return res.status(400).json({
        message: "Invalid fields in request",
      });
    }

    // ----------------------------------------------------
    // 3. Basic validations
    // ----------------------------------------------------

    // Username must be present and reasonably long for readability/uniqueness.
    if (!userName || userName.trim().length < 4) {
      return res.status(400).json({
        message: "userName should be at least 4 characters long",
      });
    }


    // Email presence check (format validation can be added later if needed).
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Password minimum length check for basic security.
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password should be at least 6 characters long",
      });
    }
 

    // 4 . check if user already exist

    const existingUser = await User.findOne({
        $or:[
            {userName},
            {email}
        ]
    })

   console.log("existedUser :", existedUser);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

// 5 . create data entry in DB

  } catch (error) {

    // ----------------------------------------------------
    // Error handling: keeps response consistent for any unexpected failure.
    // ----------------------------------------------------

    return res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
  }

}

export default registerUserController;