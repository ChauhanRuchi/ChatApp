import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const twilio = require('twilio');

@Injectable()
export class SmsService {
  private client: any;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.client = twilio(accountSid, authToken);
  }

  async sendOtp(phoneNumber: string, otp: string): Promise<void> {
    const from = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    const body = `Your OTP code is ${otp}`;

    await this.client.messages.create({
      body,
      from,
      to: phoneNumber,
    });
  }
}
