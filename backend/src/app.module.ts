import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { KeepAliveService } from './keepAlive.service';

@Module({
  imports: [ScheduleModule.forRoot()],

  controllers: [AppController],

  providers: [AppService, KeepAliveService],
})
export class AppModule {}
