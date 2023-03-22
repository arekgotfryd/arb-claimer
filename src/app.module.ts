import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [AppService],
})
export class AppModule {}
