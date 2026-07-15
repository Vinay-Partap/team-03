const authRepository = require("./auth.repository");
const jwt = require("jsonwebtoken");

class AuthService {
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET || "super_secret_jwt_key_123!", {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET || "super_secret_jwt_key_123!", {
      expiresIn: "7d",
    });
  }

  async registerUser(userData) {
    const { name, email, password, role, profile } = userData;
    const userExists = await authRepository.findByEmail(email);
    if (userExists) {
      throw new Error("User already exists");
    }

    const requestedRole = role || "citizen";
    const user = await authRepository.createUser({
      name,
      email,
      password,
      role: requestedRole,
      profile: profile || {},
    });

    const token = this.generateToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await authRepository.saveUser(user);
    return { token, refreshToken, user };
  }

  async loginUser(email, password) {
    const user = await authRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid email or password");
    }

    const token = this.generateToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await authRepository.saveUser(user);
    return { token, refreshToken, user };
  }

  async getUserProfile(userId) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUserProfile(userId, updateData) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.name = updateData.name || user.name;
    if (updateData.profile) {
      user.profile = {
        ...user.profile,
        ...updateData.profile,
      };
    }

    return await authRepository.saveUser(user);
  }

  async forgotPassword(email) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new Error("User with this email does not exist");
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "super_secret_jwt_key_123!", {
      expiresIn: "10m",
    });

    return { resetToken, user };
  }

  async resetPassword(token, newPassword) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_jwt_key_123!");
    const user = await authRepository.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }

    user.password = newPassword;
    await authRepository.saveUser(user);
    return user;
  }

  async refreshAccessToken(token) {
    if (!token) {
      throw new Error("Refresh token is required");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_jwt_key_123!");
      const user = await authRepository.findById(decoded.id);
      if (!user || user.refreshToken !== token) {
        throw new Error("Invalid refresh token");
      }

      const newAccessToken = this.generateToken(user._id);
      const newRefreshToken = this.generateRefreshToken(user._id);
      user.refreshToken = newRefreshToken;
      await authRepository.saveUser(user);

      return { token: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
      throw new Error("Invalid or expired refresh token");
    }
  }
}

module.exports = new AuthService();
