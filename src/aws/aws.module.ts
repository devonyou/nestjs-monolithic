import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';

@Module({
    providers: [
        AwsService,
        {
            provide: 'S3_CLIENT',
            useFactory: (configService: ConfigService) => {
                return new S3Client({
                    region: configService.get('AWS_REGION'),
                    credentials: {
                        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
                        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
    controllers: [AwsController],
})
export class AwsModule {}
