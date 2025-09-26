import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter, CounterDocument } from './counter.schema';

@Injectable()
export class CounterService {
  constructor(@InjectModel(Counter.name) private counterModel: Model<CounterDocument>) {}

  async getNextSequence(name: string): Promise<number> {
        const counter = await this.counterModel.findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
        );
        return counter.seq;
    }

  async initializeCounter(name: string, start: number): Promise<void> {
        const existingCounter = await this.counterModel.findOne({ _id: name });
        if (existingCounter) {
        if (existingCounter.seq < start) {
            await this.counterModel.updateOne({ _id: name }, { $set: { seq: start } });
            console.log(`Counter ${name} updated to seq: ${start}`);
        } else {
            console.log(`Counter ${name} already has seq: ${existingCounter.seq}, no update needed`);
        }
        } else {
        await this.counterModel.create({ _id: name, seq: start });
        console.log(`Counter ${name} created with seq: ${start}`);
        }
    }
}
