/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export type NewUser = {
  role: string;
  password: string;
  id: string;
};

export interface UserModel extends Model<TUser> {
  isUserExistByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(password: string, hashedPassword: string): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedAt: Date,
    jwtIssuedAt: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
