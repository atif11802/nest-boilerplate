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

  //format phone number
  formatPhoneNumber = (phone: string): string => {
    const phoneNumber = parsePhoneNumber(phone, 'BD');
    return phoneNumber.formatNational();
  };

  //create a function to understand is phone or email with regex
  isPhoneOrEmail = (
    phone_or_email: string,
  ): { phone?: string; email?: string; error?: string } => {
    const phoneRegex =
      /^\+?[0-9]{1,3}?[-. ]?\(?[0-9]{1,3}\)?[-. ]?[0-9]{1,4}[-. ]?[0-9]{1,4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (phoneRegex.test(phone_or_email)) {
      return { phone: phone_or_email };
    } else if (emailRegex.test(phone_or_email)) {
      return { email: phone_or_email };
    } else {
      return { error: 'Invalid phone or email' };
    }
  };
}
