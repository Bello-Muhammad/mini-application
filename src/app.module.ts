import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ApplicationModule } from './application/application.module';
import { QueueModule } from './jobs/queue.module';
import { MailerModule } from '@nestjs-modules/mailer';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [config] }),
     MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        },
      },
    }),
    PrismaModule,
    ApplicationModule,
    QueueModule,
  ],
})
export class AppModule { }
