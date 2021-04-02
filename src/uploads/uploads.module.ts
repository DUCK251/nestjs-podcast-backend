import { DynamicModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from './uploads.constants';
import { UploadsController } from './uploads.controller';
import { UploadModuleOptions } from './uploads.interfaces';

@Module({
  controllers: [UploadsController],
})
export class UploadsModule {
  static forRoot(options: UploadModuleOptions): DynamicModule {
    return {
      module: UploadsModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      controllers: [UploadsController],
    };
  }
}
