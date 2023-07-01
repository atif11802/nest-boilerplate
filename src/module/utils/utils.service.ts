import { Injectable } from '@nestjs/common';
import parsePhoneNumber from 'libphonenumber-js';
import normalizeEmail from 'validator/lib/normalizeEmail';

@Injectable()
export class UtilsService {
  validateEmail = (email: string): boolean | string => {
    const normalizedEmail = normalizeEmail(email);
    return normalizedEmail;
  };

  getFormattedPhoneNumber = (phone: string): boolean => {
    const phoneNumber = parsePhoneNumber(phone, 'BD');
    return phoneNumber.isValid();
  };

  //create a function to create Otp
  createOtp = (length: number): string => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
}
