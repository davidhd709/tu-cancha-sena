import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalStorageDriver } from './local-storage.driver';
import { STORAGE_DRIVER } from './storage.driver';

@Global()
@Module({
  providers: [
    LocalStorageDriver,
    {
      provide: STORAGE_DRIVER,
      useFactory: (local: LocalStorageDriver, config: ConfigService) => {
        const driver = (config.get<string>('STORAGE_DRIVER') ?? 'local').toLowerCase();
        switch (driver) {
          case 'local':
            return local;
          case 's3':
            throw new Error(
              'STORAGE_DRIVER=s3 todavía no está implementado. Instala @aws-sdk/client-s3 y agrega S3StorageDriver.'
            );
          default:
            throw new Error(`STORAGE_DRIVER="${driver}" no soportado`);
        }
      },
      inject: [LocalStorageDriver, ConfigService],
    },
  ],
  exports: [STORAGE_DRIVER],
})
export class UploadsModule {}
