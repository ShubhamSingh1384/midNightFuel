const bcrypt = require('bcryptjs');
const userModel = require('../../model/userModel.js');
const { createToken, verifyToken , } = require('../../config/jwt.js');

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare provided password with hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = createToken({ email, userId: user._id });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
const userSignup = async (req, res) => {
  //console.log("Signup attempt:", req.body);

  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new userModel({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      cart: [],
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


module.exports={userLogin,userSignup}
