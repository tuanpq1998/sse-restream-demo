import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventsService } from './event.service';
import { Event2Service } from './event2.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [EventsService, Event2Service],
})
export class AppModule {}
