import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

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
    const fileExtension = this.getFileExtension(file.originalname);
    const key = `${path}/${uuidv4()}${fileExtension}`;

    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.upload(uploadParams).promise();
    return key;
  }

  async deleteFile(key: string): Promise<void> {
    const bucket = this.configService.get('AWS_S3_BUCKET');
    
    const deleteParams = {
      Bucket: bucket,
      Key: key,
    };

    await this.s3.deleteObject(deleteParams).promise();
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const bucket = this.configService.get('AWS_S3_BUCKET');
    
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: expiresIn,
    };

    return this.s3.getSignedUrlPromise('getObject', params);
  }

  private getFileExtension(filename: string): string {
    return path.extname(filename);
  }
} 