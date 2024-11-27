import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  private snsClient: SNSClient;

  constructor(private configService: ConfigService) {
    this.snsClient = new SNSClient({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async sendOtpToPhone(phoneNumber: string, otp: string): Promise<void> {
    const message = `Your OTP for signup verification is ${otp}. This OTP is valid for 10 minutes.`;

    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
    };

    try {
      const command = new PublishCommand(params);
      const response = await this.snsClient.send(command);

      console.log(
        `OTP sent to phone number: ${phoneNumber}, Message ID: ${response.MessageId}`,
        message,
      );
    } catch (error) {
      console.error(`Failed to send OTP to ${phoneNumber}:`, error.message);
      throw new Error('Failed to send OTP. Please try again later.');
    }
  }
}
