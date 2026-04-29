import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueModule } from 'src/jobs/queue.module';

@Module({
  imports: [
    QueueModule,
    PrismaModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
            connection: {
                  host: configService.get('REDIS_HOST'),
                  port: configService.get('REDIS_PORT'),
                  password: configService.get('REDIS_PASSWORD'),
              },
            }),
            inject: [ConfigService],
      }),
    BullModule.registerQueue({ name: 'notification' }),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [BullModule],
})
export class ApplicationModule {}
