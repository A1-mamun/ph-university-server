import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// hash password before saving
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set password to empty string before sending response
userSchema.post('save', function (doc, next) {
  doc.password = ' ';
  next();
});

userSchema.statics.isUserExistByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  password: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(password, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedAt: Date,
  jwtIssuedAt: number,
) {
  return jwtIssuedAt < passwordChangedAt.getTime() / 1000;
};

export const User = model<TUser, UserModel>('User', userSchema);
