const isAuthentiCatedController = async (req,res) =>{

    try {
    return res.json({
      success: true,
      
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "error chectich whether user is authenticated or not.",
      error: error.message,
    });
  }
} 

export default isAuthentiCatedController;