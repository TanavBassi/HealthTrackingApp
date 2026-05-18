import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { KeepAliveService } from './keepAlive.service';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],

  controllers: [AppController],

  providers: [AppService, KeepAliveService],
})
export class AppModule {}
