const authRepository = require('./auth.repository');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const jwksClient = require('jwks-rsa');
const { sendEmail, verificationEmail, resetEmail, passwordResetSuccessEmail } = require('../../services/email.service');
const AuthSession = require('./authSession.model');

const safeUser = (user) => ({ _id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile, officialProfile: user.officialProfile, organizationProfile: user.organizationProfile, researcherProfile: user.researcherProfile, department: user.department, accountStatus: user.accountStatus, savedPolicies: user.savedPolicies, savedSchemes: user.savedSchemes });
class AuthService {
  generateToken(id) { return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' }); }
  generateRefreshToken(id, sid) { return jwt.sign({ id, sid }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); }
  async issueTokens(user) {
    const session = await AuthSession.create({ userId:user._id, tokenHash:'pending', expiresAt:new Date(Date.now()+604800000) });
    const token = this.generateToken(user._id); const refreshToken = this.generateRefreshToken(user._id, session._id.toString());
    session.tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex'); await session.save();
    user.refreshToken = session.tokenHash; await user.save();
    return { token, refreshToken, user: safeUser(user) };
  }
  async registerUser({ name, email, password, role, profile = {} }) {
    const normalizedEmail = String(email).trim().toLowerCase();
    if (await authRepository.findByEmail(normalizedEmail)) throw new Error('An account with this email already exists');
    const selfServiceRoles = ['citizen', 'researcher', 'organization', 'official'];
    const safeRole = selfServiceRoles.includes(role) ? role : 'citizen';
    const pendingOfficial = safeRole === 'official';
    const user = await authRepository.createUser({ name: String(name).trim(), email: normalizedEmail, password, role: safeRole, profile, isActive: !pendingOfficial, accountStatus: pendingOfficial ? 'pending_verification' : 'active' });
    if (pendingOfficial) return { pendingVerification: true, user: safeUser(user) };
    const token = crypto.randomBytes(32).toString('hex'); user.emailVerificationTokenHash = crypto.createHash('sha256').update(token).digest('hex'); user.emailVerificationExpiresAt = new Date(Date.now() + 24*60*60*1000); await user.save();
    const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`; await sendEmail({ to: user.email, ...verificationEmail(url) });
    return this.issueTokens(user);
  }
  async loginUser(email, password) {
    const user = await authRepository.findByEmail(String(email).trim().toLowerCase());
    if (!user || !user.isActive) throw new Error('Invalid email or password');
    if (user.lockUntil && user.lockUntil > new Date()) throw new Error('Account temporarily locked. Try again later.');
    if (!(await user.comparePassword(password))) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1; user.lastFailedLoginAt = new Date();
      if (user.failedLoginAttempts >= 5) { user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); user.failedLoginAttempts = 0; }
      await user.save(); throw new Error('Invalid email or password');
    }
    user.failedLoginAttempts = 0; user.lockUntil = null; await user.save();
    return this.issueTokens(user);
  }
  async getUserProfile(id) { const user = await authRepository.findById(id); if (!user) throw new Error('User not found'); return safeUser(user); }
  async updateUserProfile(id, { name, profile, officialProfile, organizationProfile, researcherProfile, department }) {
    const user = await authRepository.findById(id); if (!user) throw new Error('User not found');
    if (name) user.name = String(name).trim();
    if (department !== undefined && user.role === "official") user.department = String(department).trim();
    if (officialProfile && user.role === "official") user.officialProfile = { ...user.officialProfile.toObject?.() || {}, ...officialProfile };
    if (organizationProfile && user.role === "organization") user.organizationProfile = { ...user.organizationProfile.toObject?.() || {}, ...organizationProfile };
    if (researcherProfile && user.role === "researcher") user.researcherProfile = { ...user.researcherProfile.toObject?.() || {}, ...researcherProfile };
    if (profile) user.profile = { ...user.profile.toObject(), ...profile }; await user.save(); return user;
  }
  async createPasswordReset(email) {
    const user = await authRepository.findByEmail(String(email).trim().toLowerCase()); if (!user) return null;
    const rawToken = crypto.randomBytes(32).toString('hex'); user.passwordResetTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex'); user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000); await user.save();
    await sendEmail({ to: user.email, ...resetEmail(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`) });
    return { user };
  }
  async resetPassword(token, newPassword) {
    const hash = crypto.createHash('sha256').update(token).digest('hex'); const User = require('../users/users.model');
    const user = await User.findOne({ passwordResetTokenHash: hash, passwordResetExpiresAt: { $gt: new Date() } }); if (!user) throw new Error('Reset link is invalid or expired');
    user.password = newPassword; user.passwordResetTokenHash = null; user.passwordResetExpiresAt = null; user.refreshToken = ''; await user.save(); await sendEmail({ to: user.email, ...passwordResetSuccessEmail() }); return user;
  }
  async verifyEmail(token) { const hash = crypto.createHash('sha256').update(token).digest('hex'); const User = require('../users/users.model'); const user = await User.findOne({ emailVerificationTokenHash: hash, emailVerificationExpiresAt: { $gt: new Date() } }); if (!user) throw new Error('Verification link is invalid or expired'); user.emailVerified = true; user.emailVerificationTokenHash = null; user.emailVerificationExpiresAt = null; await user.save(); return user; }
  async refreshAccessToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); const user = await authRepository.findById(decoded.id); const session = decoded.sid && await AuthSession.findById(decoded.sid);
    if (!user || !session || session.revokedAt || session.expiresAt < new Date() || session.tokenHash !== crypto.createHash('sha256').update(refreshToken).digest('hex')) throw new Error('Invalid refresh token'); session.revokedAt = new Date(); session.revokeReason='rotated'; await session.save(); return this.issueTokens(user);
  }
  async loginWithGoogle(profile) {
    const email = profile.emails?.[0]?.value?.toLowerCase();
    if (!email) throw new Error('Google did not provide a verified email');
    let user = await authRepository.findByEmail(email);
    if (!user) user = await authRepository.createUser({ name: profile.displayName || email.split('@')[0], email, password: crypto.randomBytes(32).toString('hex'), role: 'citizen' });
    if (!user.isActive) throw new Error('This account is inactive');
    return this.issueTokens(user);
  }

  async loginWithAuth0(idToken, requestedRole = 'citizen') {
    const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;
    if (!domain || !clientId) throw new Error('Auth0 is not configured');
    const client = jwksClient({ jwksUri: `https://${domain}/.well-known/jwks.json`, cache: true, rateLimit: true });
    const decoded = jwt.decode(idToken, { complete: true });
    if (!decoded?.header?.kid) throw new Error('Invalid Auth0 token');
    const key = await client.getSigningKey(decoded.header.kid);
    const claims = jwt.verify(idToken, key.getPublicKey(), { algorithms: ['RS256'], issuer: `https://${domain}/`, audience: clientId });
    if (!claims.email || !claims.email_verified) throw new Error('A verified email is required for OAuth login');
    const email = claims.email.toLowerCase();
    let user = await authRepository.findByEmail(email);
    if (!user) {
      const roles = ['citizen', 'researcher', 'organization'];
      user = await authRepository.createUser({ name: claims.name || email.split('@')[0], email, password: crypto.randomBytes(32).toString('hex'), role: roles.includes(requestedRole) ? requestedRole : 'citizen' });
    }
    if (!user.isActive) throw new Error('This account is inactive');
    return this.issueTokens(user);
  }

  async revokeRefreshToken(token, reason = "logout") { try { const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET); if (decoded.sid) await AuthSession.findByIdAndUpdate(decoded.sid, { revokedAt:new Date(), revokeReason:reason }); } catch (_) {} }
  async revokeAllSessions(userId) { await AuthSession.updateMany({ userId, revokedAt:null }, { revokedAt:new Date(), revokeReason:"logout_all" }); }
  async getSessions(userId) { return AuthSession.find({ userId }).sort({ lastUsedAt:-1 }).select("-tokenHash"); }
}
module.exports = new AuthService();

