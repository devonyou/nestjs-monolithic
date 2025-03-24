import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { join } from 'path';
import { cwd } from 'process';
import * as ffmpegFluent from 'fluent-ffmpeg';
import { writeFileSync } from 'fs';

@Processor('product-thumbnail')
export class ProductThumbnailWorker extends WorkerHost {
    async process(job: Job, token?: string): Promise<any> {
        const { videoId } = job.data;
        const videoPath = join(cwd(), 'assets', 'sample.mp4');
        const outputDirectory = join(cwd(), 'public', 'thumbnail', `${videoId}.txt`);

        console.log(`영상 트랜스코딩중... ID:${videoId}`);
        writeFileSync(outputDirectory, 'Hello Bullmq');

        // ffmpegFluent(videoPath)
        //     .screenshots({
        //         count: 1,
        //         filename: `${videoId}.png`,
        //         folder: outputDirectory,
        //         size: '320x240',
        //     })
        //     .on('end', () => {
        //         console.log('Thumbnail 생성 완료', videoId);
        //     })
        //     .on('error', err => {
        //         console.log('Thumbnail 생성 실패', videoId);
        //         console.log(err);
        //     });

        return 0;
    }
}
