import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Counter, CounterSchema } from './counter.schema';
import { CounterService } from './counter.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }])],
  providers: [CounterService],
  exports: [CounterService], // <-- Muy importante exportarlo
})
export class CounterModule {}
