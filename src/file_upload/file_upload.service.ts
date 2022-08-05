import { Injectable, Req, Res } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import s3Storage = require('multer-sharp-s3');
import multerS3 = require('multer-s3');
// import multerS3 from 'multer-s3';
import sharp = require('sharp');
import * as fs from 'fs';
import * as path from 'path';
import * as Busboy from 'busboy';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'fins3bucket';
const MAX_SIZE = process.env.MAX_SIZE || 10000000;
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-central-1',
});
// Array of allowed files
const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif', 'pdf'];
const array_of_allowed_file_types = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'application/pdf',
];

const sizes = {
  large: [2048, 2048],
  medium: [1024, 1024],
  thumb: [300, 300],
};

@Injectable()
export class FileUploadService {
  async fileupload(@Req() req, @Res() res, file) {
    // Get the extension of the uploaded file
    const file_extension = file.originalname.slice(
      ((file.originalname.lastIndexOf('.') - 1) >>> 0) + 2,
    );

    console.log(MAX_SIZE);
    // Check if the uploaded file is allowed
    if (
      !array_of_allowed_files.includes(file_extension) ||
      !array_of_allowed_file_types.includes(file.mimetype)
    ) {
      throw Error('Invalid file');
    }

    // Allowed file size in mb
    if (file.size > MAX_SIZE) {
      throw Error('File too large');
    }

    const urlKey = `${Date.now().toString()} - ${file.originalname}`;

    if (file.mimetype.includes('image')) {
      const { size } = req.body;

      return sharp(file.buffer)
        .resize(sizes[size][0], sizes[size][1])
        .toBuffer()
        .then((buffer) => {
          return s3
            .putObject({
              Body: buffer,
              Bucket: AWS_S3_BUCKET_NAME,
              Key: urlKey,
            })
            .promise()
            .then(
              (data) => {
                return urlKey;
              },
              (err) => {
                return err;
              },
            );
        });
    } else {
      return await s3
        .putObject({
          Body: file.buffer,
          Bucket: AWS_S3_BUCKET_NAME,
          Key: urlKey,
        })
        .promise()
        .then(
          (data) => {
            return urlKey;
          },
          (err) => {
            return err;
          },
        );
    }
  }

  // upload = multer({
  //   storage: multerS3({
  //     s3: s3,
  //     bucket: AWS_S3_BUCKET_NAME,
  //     acl: 'public-read',
  //     key: function (request, file, cb) {
  //       console.log(file);
  //       cb(null, `${Date.now().toString()} - ${file.originalname}`);
  //     },
  //     resize: {
  //       width: 600,
  //       height: 400,
  //     },
  //   }),
  // }).single('upload');
}
