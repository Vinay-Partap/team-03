const nodemailer = require('nodemailer');
const configured = () => ['SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','SMTP_FROM'].every((key) => Boolean(process.env[key]));
const transporter = () => nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT), secure: process.env.SMTP_SECURE === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
async function sendEmail({ to, subject, html, text }) { if (!configured()) { console.warn('[email] SMTP not configured; email not sent'); return { skipped: true }; } return transporter().sendMail({ from: process.env.SMTP_FROM, to, subject, text, html }); }
const link = (url, label) => `<p>${label}</p><p><a href="${url}">${url}</a></p>`;
const verificationEmail = (url) => ({ subject: 'Verify your GovIntel email', text: `Verify your email: ${url}`, html: link(url, 'Verify your GovIntel email address.') });
const resetEmail = (url) => ({ subject: 'Reset your GovIntel password', text: `Reset your password: ${url}`, html: link(url, 'Reset your GovIntel password.') });
const passwordResetSuccessEmail = () => ({ subject: 'Your GovIntel password was changed', text: 'Your password was changed successfully.', html: '<p>Your GovIntel password was changed successfully.</p>' });
async function verifySmtp() { if (!configured()) return { configured: false }; await transporter().verify(); return { configured: true }; }
module.exports = { sendEmail, verificationEmail, resetEmail, passwordResetSuccessEmail, verifySmtp, configured };
