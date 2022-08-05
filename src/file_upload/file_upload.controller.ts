import {
  Controller,
  Post,
  Req,
  UsePipes,
  Res,
  UseGuards,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileUploadService } from './file_upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('fileupload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('upload'))
  async create(
    @Req() request,
    @Res() response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const f = await this.fileUploadService
        .fileupload(request, response, file)
        .catch((error) => {
          return response
            .status(500)
            .json(`Failed to upload image file: ${error.message}`);
        });
      return response.status(200).json(f);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }
}
