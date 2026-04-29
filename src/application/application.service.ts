import { Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

import { Role } from 'src/generated/prisma/enums';
@Injectable()
export class ApplicationService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('notification') private readonly notificationQueue: Queue
  ) { }

  async create(createApplicationDto: CreateApplicationDto, file: Express.Multer.File) {
    const mockS3Url = `https://s3.amazonaws.com/cv-bucke/${Date.now()}-${file.originalname}`;

    return await this.prisma.$transaction(async(tx) => {
      //create user
      const user = await tx.user.create({
        data: {
          firstName: createApplicationDto.firstName,
          lastName: createApplicationDto.lastName,
          email: createApplicationDto.email,
          phone: createApplicationDto.phone,
          role: createApplicationDto.role as Role
        }
      });

      //save user mock cv document url
      await tx.document.create({
        data: {
          userId: user.id,
          docUrl: mockS3Url
        }
    });

    //
    await tx.application.create({
      data: {
        userId: user.id,
        currentStage: "APPLIED"
      }
    });

    await this.notificationQueue.add('send-email', {
      email: createApplicationDto.email,
      firstName: createApplicationDto.firstName,
      type: "WELCOME"
    });

    return user;
    });
  }

  getUserApplications(userId: string) {
    return this.prisma.application.findMany({
      where: {
        userId
      },
      include: {
        user: {
          include: {
            documents: true
          }
        }
      }
    });
  }

  findOne(id: string) {
    return this.prisma.application.findUnique({
      where: {
        id
      },
      include: {
        user: {
          include: {documents: true}
        }
      }
    });
  }

}
