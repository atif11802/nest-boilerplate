import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [ConfigService],
})
export class ConfigModule {
  static register({ isGlobal = false }): DynamicModule {
    return {
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
      global: isGlobal,
    };
  }
}
