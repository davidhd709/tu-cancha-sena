import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { extname, join, resolve } from 'path';
import { SavedFile, StorageDriver } from './storage.driver';

@Injectable()
export class LocalStorageDriver implements StorageDriver {
  private readonly dir: string;
  private readonly publicBaseUrl: string;

  constructor(config: ConfigService) {
    this.dir = resolve(process.cwd(), config.get<string>('UPLOADS_DIR') ?? 'uploads');
    this.publicBaseUrl = config.get<string>('PUBLIC_BASE_URL') ?? '';
  }

  async save(file: Express.Multer.File): Promise<SavedFile> {
    await fs.mkdir(this.dir, { recursive: true });
    const key = `${randomUUID()}${extname(file.originalname)}`;
    await fs.writeFile(join(this.dir, key), file.buffer);
    return { key, url: `${this.publicBaseUrl}/uploads/${key}` };
  }
}
