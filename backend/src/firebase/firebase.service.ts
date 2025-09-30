import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import sharp from 'sharp';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  // Using 'any' as a workaround for TypeScript type resolution issues with admin.storage.Bucket
  private bucket: any;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      const serviceAccountBase64 = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_KEY_BASE64');
      if (!serviceAccountBase64) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 is not set in environment variables.');
      }
      const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('ascii'));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: serviceAccount.project_id + '.appspot.com',
      });

      this.bucket = admin.storage().bucket();
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error.message);
      throw new InternalServerErrorException('Failed to initialize Firebase Admin SDK.');
    }
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'menu-items'): Promise<string | null> {
    if (!file) {
      return null;
    }

    const filename = `${folder}/${Date.now()}-${file.originalname}`;
    const fileUpload = this.bucket.file(filename);

    // Compress image using sharp
    const compressedImageBuffer = await sharp(file.buffer)
      .resize(800) // Resize to a max width of 800px
      .jpeg({ quality: 80 }) // Compress to JPEG with 80% quality
      .toBuffer();

    return new Promise((resolve, reject) => {
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: 'image/jpeg',
        },
      });

      blobStream.on('error', (error) => reject(error));

      blobStream.on('finish', async () => {
        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileUpload.name}`;
        resolve(publicUrl);
      });

      blobStream.end(compressedImageBuffer);
    });
  }
}