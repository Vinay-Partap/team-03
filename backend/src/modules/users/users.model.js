const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "official", "citizen", "researcher", "organization", "guest"],
      default: "citizen",
    },
    profile: {
      age: { type: Number, default: null },
      gender: { type: String, default: "" },
      income: { type: Number, default: null },
      occupation: { type: String, default: "" },
      education: { type: String, default: "" },
      state: { type: String, default: "" },
      category: { type: String, default: "" },
      disability: { type: Boolean, default: false },
    },
    savedPolicies: [{ type: Schema.Types.ObjectId, ref: "Policies" }],
    savedSchemes: [{ type: Schema.Types.ObjectId, ref: "Schemes" }],
    searchHistory: [{ type: String }],
    notificationPreferences: { inApp:{type:Boolean,default:true}, email:{type:Boolean,default:true}, policyAlerts:{type:Boolean,default:true}, schemeUpdates:{type:Boolean,default:true}, deadlineReminders:{type:Boolean,default:true}, applicationUpdates:{type:Boolean,default:true}, announcements:{type:Boolean,default:true} },
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String, default: "" },
    mfaRecoveryCodes: [{ type: String }],
    privacyConsent: { type: Boolean, default: false },
    privacyConsentAt: { type: Date, default: null },
    privacyPolicyVersion: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
    passwordResetTokenHash: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, default: null },
    emailVerificationExpiresAt: { type: Date, default: null },
    passwordResetExpiresAt: { type: Date, default: null },
    department: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lastFailedLoginAt: { type: Date, default: null },
    accountStatus: { type: String, enum: ["active", "suspended", "pending_verification", "disabled"], default: "active" },
    statusReason: { type: String, default: "" },
    officialProfile: { organization: { type: String, default: "" }, designation: { type: String, default: "" }, verifiedAt: { type: Date, default: null } },
    organizationProfile: { name: { type: String, default: "" }, type: { type: String, default: "" } },
    researcherProfile: { institution: { type: String, default: "" }, domain: { type: String, default: "" } },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1 });


// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
