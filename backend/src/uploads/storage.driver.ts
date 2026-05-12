export const STORAGE_DRIVER = 'STORAGE_DRIVER';

export interface SavedFile {
  key: string;
  url: string;
}

export interface StorageDriver {
  save(file: Express.Multer.File): Promise<SavedFile>;
}
