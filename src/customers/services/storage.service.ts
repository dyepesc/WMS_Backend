// src/common/services/storage.service.ts
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    const bucket = this.configService.get('AWS_S3_BUCKET');
    const key = `${path}/${Date.now()}_${file.originalname}`;

    await this.s3.upload({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }).promise();

    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }

  async getSignedUrl(fileUrl: string): Promise<string> {
    const bucket = this.configService.get('AWS_S3_BUCKET');
    const key = fileUrl.replace(`https://${bucket}.s3.amazonaws.com/`, '');

    const signedUrl = await this.s3.getSignedUrlPromise('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: 3600, // URL expires in 1 hour
    });

    return signedUrl;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const bucket = this.configService.get('AWS_S3_BUCKET');
    const key = fileUrl.replace(`https://${bucket}.s3.amazonaws.com/`, '');

    await this.s3.deleteObject({
      Bucket: bucket,
      Key: key,
    }).promise();
  }
}