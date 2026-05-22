import { Module } from '@nestjs/common';
import { AdditionalServicesService } from './additional-services.service';
import { AdditionalServicesController } from './additional-services.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [AdditionalServicesController],
  providers: [AdditionalServicesService],
  exports: [AdditionalServicesService],
})
export class AdditionalServicesModule {}
