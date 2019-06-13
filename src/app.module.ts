import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AllExceptionsFilter } from './common/filters/exception.filter';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { MONGO_URI } from './configs/constants';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: MONGO_URI,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
      useNewUrlParser: true,
      logging: 'all',
      logger: 'file',
    }),
    CacheModule.register({
      ttl: 10, // 10s
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
