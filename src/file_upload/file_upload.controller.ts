import {
  Controller,
  Post,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileUploadService } from './file_upload.service';
import { fileValidation } from './file.validation';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('fileupload')
export class FileUploadController {
  private MAX_SIZE: number = +process.env.MAX_SIZE;
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('upload', {
      fileFilter: fileValidation,
    }),
  )
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (request.body.fileValidationError || request.file.size > this.MAX_SIZE) {
      return response
        .status(500)
        .json(
          `Failed to upload file: ${
            request.body.fileValidationError || 'file is too big'
          }`,
        );
    }

    await this.fileUploadService
      .fileupload(request, response, file)
      .catch((error) => {
        return response
          .status(500)
          .json(`Failed to upload image file: ${error.message}`);
      });
    return response.status(200).json('File uploaded successfully');
  }
}
