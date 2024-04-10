import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  getDataSourceByName,
} from 'typeorm-transactional';

import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { ApiConfigService } from '@/shared/services/api-config.service';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        const newDataSource = addTransactionalDataSource(
          new DataSource(options),
        );

        const existedDataSource = getDataSourceByName(options.name || '');

        const dataSource = existedDataSource || newDataSource;

        return Promise.resolve(dataSource);
      },
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
