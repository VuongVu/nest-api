import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AllExceptionsFilter } from './common/filters/exception.filter';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { MONGO_URI } from './configs/vars';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI, {
      useFindAndModify: true,
      useCreateIndex: true,
      useNewUrlParser: true,
    }),
    CacheModule.register({
      ttl: 60 * 60, // 1 hours
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
  ],
})
export class AppModule {}
