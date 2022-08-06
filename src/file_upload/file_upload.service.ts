import { Injectable, Req, Res } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import sharp = require('sharp');
import { Request, Response } from 'express';
import { AWSError, S3 } from 'aws-sdk';

const sizes = {
  large: [2048, 2048],
  medium: [1024, 1024],
  thumb: [300, 300],
};

@Injectable()
export class FileUploadService {
  private AWS_S3_BUCKET_NAME: string = process.env.AWS_S3_BUCKET_NAME;
  private s3: S3;
  constructor() {
    this.s3 = new AWS.S3();
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'eu-central-1',
    });
  }
  async fileupload(
    @Req() req: Request,
    @Res() res: Response,
    file: Express.Multer.File,
  ): Promise<string | AWSError> {
    const urlKey = `${Date.now().toString()} - ${file.originalname}`;

    if (file.mimetype.includes('image')) {
      const { size } = req.body;

      return sharp(file.buffer)
        .resize(sizes[size][0], sizes[size][1])
        .toBuffer()
        .then((buffer) => {
          return this.s3
            .putObject({
              Body: buffer,
              Bucket: this.AWS_S3_BUCKET_NAME,
              Key: urlKey,
            })
            .promise()
            .then(
              () => {
                return urlKey;
              },
              (err) => {
                throw err;
              },
            );
        });
    } else {
      return await this.s3
        .putObject({
          Body: file.buffer,
          Bucket: this.AWS_S3_BUCKET_NAME,
          Key: urlKey,
        })
        .promise()
        .then(
          () => {
            return urlKey;
          },
          (err) => {
            throw err;
          },
        );
    }
  }
}
