import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AllExceptionsFilter } from './common/filters/exception.filter';

import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';

import { MONGO_URI } from './configs/vars';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI, {
      useFindAndModify: false,
      useCreateIndex: true,
      useNewUrlParser: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
