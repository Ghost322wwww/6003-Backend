import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user', 'operator'], default: 'user' },
  avatar:   {type: String, default: ''},
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export default User;
