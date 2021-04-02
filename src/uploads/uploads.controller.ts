import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { CONFIG_OPTIONS } from './uploads.constants';
import { UploadModuleOptions } from './uploads.interfaces';

@Controller('uploads')
export class UploadsController {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: UploadModuleOptions,
  ) {}

  getUniqueFileName(originalname: string) {
    return `${uuidv4() + originalname}`;
  }

  getObjectURL(objectName: string) {
    return `https://${this.options.bucketName}.s3.amazonaws.com/${objectName}`;
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.options.accessKeyId,
        secretAccessKey: this.options.secretAccessKey,
      },
    });
    try {
      const objectName = this.getUniqueFileName(file.originalname);
      const upload = await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: this.options.bucketName,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();
      const url = this.getObjectURL(objectName);
      return { url };
    } catch (e) {
      return null;
    }
  }
}
