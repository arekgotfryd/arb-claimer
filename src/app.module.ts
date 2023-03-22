import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './CronService';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [AppService, CronService],
})
export class AppModule {}
