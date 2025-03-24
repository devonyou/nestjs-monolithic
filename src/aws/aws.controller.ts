import { Controller, Post } from '@nestjs/common';
import { AwsService } from './aws.service';

@Controller('aws')
export class AwsController {
    constructor(private readonly awsService: AwsService) {}

    @Post('presigned-url')
    async createPresignedUrl() {
        return await this.awsService.createPresignedUrl();
    }
}
