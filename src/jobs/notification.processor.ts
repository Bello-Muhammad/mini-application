import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { MailerService } from "@nestjs-modules/mailer";

export interface WelcomeEmailJobData {
    email: string;
    firstName: string;
}

export interface ApplicationStatusJobData {
    email: string;
    firstName: string;
    status: 'ACCEPTED' | 'REJECTED';
}

@Processor('notification')
export class NotificationProcessor extends WorkerHost {
    constructor(private readonly mailService: MailerService) {
        super();
    }
    private readonly logger = new Logger(NotificationProcessor.name);

    async process(job: Job<any, any, string>): Promise<any> {
        const { email, firstName, type } = job.data;

        switch (type) {
            case 'WELCOME':
                return this.handleWelcomeEmail(job);
            case 'STATUS_CHANGE':
                return this.handleApplicationStatus(job);
            default:
                this.logger.warn(`Unknown job type: ${job.name}`);
        }
        return {}
    }

    private async handleWelcomeEmail(job: Job<WelcomeEmailJobData>): Promise<void> {
        const { email, firstName } = job.data;

        // Simulate sending welcome email
        this.logger.log(`Sending welcome email to ${email}`);
        this.logger.log(`Welcome email content: Dear ${firstName}, your application has been received.`);

        // In production, integrate with email service (SendGrid, AWS SES, etc.)
        console.log(`
    ========================================
    📧 WELCOME EMAIL SENT
    ========================================
    To: ${email}
    Subject: Welcome to Our Candidate Portal!
    Body: Dear ${firstName},
    
    Thank you for submitting your application!
    
    We will review your application and get back to you soon.
    
    Best regards,
    The HR Team
    ========================================
    `);

        this.mailService.sendMail({
            from: process.env.MYEMAIL,
            to: email,
            subject: "Welcome to Our Candidate Portal!",
            text: `Dear ${firstName},
    
    Thank you for submitting your application!
    
    We will review your application and get back to you soon.
    
    Best regards,
    The HR Team
    ========================================
    `});
    }

    private async handleApplicationStatus(job: Job<ApplicationStatusJobData>): Promise<void> {
        const { email, firstName, status } = job.data;

        // Simulate sending status notification
        this.logger.log(`Sending ${status} notification to ${email}`);

        const statusMessage = status === 'ACCEPTED'
            ? 'Congratulations! Your application has been accepted.'
            : 'Thank you for your interest. Your application has been not selected.';

        console.log(`
    ========================================
    📧 APPLICATION STATUS NOTIFICATION
    ========================================
    To: ${email}
    Subject: Application Status Update - ${status}
    Body: Dear ${firstName},
    
    
    Your application has be ${statusMessage}
    
    Best regards,
    The HR Team
    ========================================
    `);

        this.mailService.sendMail({
            from: process.env.MYEMAIL,
            to: email,
            subject: "Welcome to Our Candidate Portal!",
            text: `Dear ${firstName},
            
    Your application has be ${statusMessage}
    
    Best regards,
    The HR Team
    ========================================
    `})
    }
}