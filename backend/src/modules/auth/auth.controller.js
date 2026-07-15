const jwt = require("jsonwebtoken");
const User = require("../users/users.model");
const { logAction } = require("../auditLogs/auditLogs.service");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "super_secret_jwt_key_123!", {
    expiresIn: "30d",
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, profile } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const requestedRole = role || "citizen";
    // For demo/development safety, we allow admin role to be registered
    const user = await User.create({
      name,
      email,
      password,
      role: requestedRole,
      profile: profile || {},
    });

    const token = generateToken(user._id);

    await logAction({
      action: "USER_REGISTER",
      userId: user._id,
      userRole: user.role,
      details: `Registered new user: ${user.email} as ${user.role}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    await logAction({
      action: "USER_LOGIN",
      userId: user._id,
      userRole: user.role,
      details: `Logged in user: ${user.email}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        savedPolicies: user.savedPolicies,
        savedSchemes: user.savedSchemes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = req.body.name || user.name;
    if (req.body.profile) {
      user.profile = {
        ...user.profile,
        ...req.body.profile,
      };
    }

    const updatedUser = await user.save();

    await logAction({
      action: "USER_UPDATE_PROFILE",
      userId: user._id,
      userRole: user.role,
      details: `Updated profile details`,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile,
        savedPolicies: updatedUser.savedPolicies,
        savedSchemes: updatedUser.savedSchemes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User with this email does not exist" });
    }

    // In a production app, we would send a real token email.
    // For this prototype, we return a simulated reset token.
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "super_secret_jwt_key_123!", {
      expiresIn: "10m",
    });

    await logAction({
      action: "USER_FORGOT_PASSWORD_REQUEST",
      userId: user._id,
      userRole: user.role,
      details: `Requested password reset link`,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({
      success: true,
      message: "Password reset link generated successfully (Simulated Email Send)",
      token: resetToken, // For the prototype frontend to immediately direct to reset page
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_jwt_key_123!");
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    await logAction({
      action: "USER_RESET_PASSWORD",
      userId: user._id,
      userRole: user.role,
      details: `Reset password successfully`,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
};
