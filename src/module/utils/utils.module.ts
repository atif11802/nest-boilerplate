import { DynamicModule, Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';

@Module({
  controllers: [UtilsController],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {
  static forRoot({ isGlobal = false }): DynamicModule {
    return {
      module: UtilsModule,
      global: isGlobal,
    };
  }
}
