const bcrypt = require("bcryptjs");
// const { createToken } = require("../../config/jwt");
const jwt = require("jsonwebtoken");
const Admin = require("../../model/adminModel"); // Import the Admin model

// Admin Signup
const signupAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(200).json({
      message: "Insufficent Data",
      success: false,
    });
  }

  // Check if email already exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    // console.log("existing" , existingAdmin);
    return res.status(200).json({
      message: "Admin already exists with this email.",
      success: false,
    });
  }

  try {
    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin instance
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Generate JWT token
    
    // const token = createToken(newAdmin._id, email);

    // Respond with the token and admin details
    res.status(200).json({
      message: "Admin signed up successfully.",
      // token,
      data: newAdmin,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during signup." });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body)
  // console.log(email, password);
  try {
    if (!email || !password) {
      return res.status(200).json({
        message: "Insufficient Data",
        success: false,
      });
    }
    // Check if admin exists
    const admin = await Admin.findOne({email});
    // console.log(admin)
    if (!admin) {
      return res
        .status(200)
        .json({ 
          message: "Admin not found with this email.",
          success: false,
        });
    }

    // Compare password
    // const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (password != admin.password) {
      return res.status(200).json({ 
        message: "Incorrect password.",
        success: false,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      process.env.ADMIN_JWT_SECRET_KEY,
      { expiresIn: "5h" }
    );

    // Respond with the token and admin details
    res.status(200).json({
      message: "Admin logged in successfully.",
      token,
      data: admin,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({ 
      message: "Server error during login.",
      success: false,
    });
  }
};

module.exports = { signupAdmin, loginAdmin };