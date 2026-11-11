const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin'], default: 'admin' },
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = (plain) => bcrypt.hash(plain, 12);
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};
userSchema.methods.toJSON = function () {
  return { id: this._id, name: this.name, email: this.email, role: this.role };
};

module.exports = mongoose.model('User', userSchema);
