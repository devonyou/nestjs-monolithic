import {
    CopyObjectCommand,
    CopyObjectCommandInput,
    DeleteObjectCommand,
    DeleteObjectCommandInput,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AwsService {
    constructor(
        @Inject('S3_CLIENT') private readonly s3Client: S3Client,
        private readonly configService: ConfigService,
    ) {}

    async createPresignedUrl(expiresIn = 300) {
        try {
            const filename = `${uuid()}.png`;
            const command = new PutObjectCommand({
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Key: `public/temp/${filename}`,
            });

            const url = await getSignedUrl(this.s3Client, command, { expiresIn });

            return {
                url,
                filename,
            };
        } catch (err) {
            throw new InternalServerErrorException('S3 PresignedURL Exception');
        }
    }

    async saveMovieToPermantStorage(filename: string) {
        try {
            const bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

            const copyParams: CopyObjectCommandInput = {
                Bucket: bucketName,
                CopySource: `${bucketName}/public/temp/${filename}`,
                Key: `public/movie/${filename}`,
            };
            const copyCommand = new CopyObjectCommand(copyParams);

            await this.s3Client.send(copyCommand);

            const deleteParms: DeleteObjectCommandInput = {
                Bucket: bucketName,
                Key: `public/temp/${filename}`,
            };
            const deleteCommand = new DeleteObjectCommand(deleteParms);
            await this.s3Client.send(deleteCommand);
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException('S3 Exception');
        }
    }
}
