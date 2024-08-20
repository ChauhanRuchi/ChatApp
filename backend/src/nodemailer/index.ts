import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class NodeMailerService {

  constructor(  private readonly mailService:MailerService
  ) {
  }

  async sendEmail(
    from: string,
    to: string,
    subject: any,
    template: string,
    context: any,
  ) {
    
    const msg = {
        from,
        to,
        subject,
        template,
        context,
      };
  

    try {
      await this.mailService.sendMail(msg);
      console.log('Email sent successfully',msg);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
