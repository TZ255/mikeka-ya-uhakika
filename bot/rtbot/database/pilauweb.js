const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },
    points: {type: Number, default: 0},
    videos: { type: Array },
    payments: { type: Array },
    status: { type: String, default: 'pending' },
    resetOTP: { type: String, default: '' },
    otpExpires: { type: Date }
  },
  { strict: false, timestamps: true }
);

const pilauzone = mongoose.connection.useDb('pilauzone')
const PilauWebUserModel = pilauzone.model('User', UserSchema);
module.exports = PilauWebUserModel