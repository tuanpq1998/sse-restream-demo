import { Injectable } from '@nestjs/common';
import { fromEvent, takeUntil } from 'rxjs';
import { EventEmitter } from 'events';
import { Event2Service } from './event2.service';

@Injectable()
export class EventsService {
  private readonly emitter: EventEmitter;

  constructor(private event2Service: Event2Service) {
    // Inject some Service here and everything about SSE will stop to work.
    this.emitter = new EventEmitter();
  }

  subscribe() {
    const event = fromEvent(this.emitter, 'streaming');
    return event.pipe(takeUntil(fromEvent(this.emitter, 'end')));
  }

  emit(data) {
    this.emitter.emit('streaming', data);
  }

  unSubscribe() {
    console.log(this.event2Service.getUserFakeInfo());
    this.emitter.emit('end', null);
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  merger(origin, newObj) {
    return newObj.halfDynamicText.text == '[DONE]'
      ? origin
      : {
          ...origin,
          halfDynamicText: {
            ...origin.halfDynamicText,
            text: origin.halfDynamicText.text + newObj.halfDynamicText.text,
          },
        };
  }

  async peformRestream() {
    const fetchResp = await fetch('http://localhost:3000/sse');
    const reader = fetchResp.body.getReader();
    let saveData = {};
    while (true) {
      const { value, done } = await reader.read();
      const utf8Decoder = new TextDecoder('utf-8');

      const data: string = utf8Decoder.decode(value, { stream: true });
      // data = `id: 1
      // data: <data>
      // `
      const regex = /^(id: \d+\n+data: )/g;
      const result = data.trim().replace(regex, '');
      if (result.trim() != '') {
        console.log({ result });
        const parsed = JSON.parse(result);
        saveData = this.isEmpty(saveData)
          ? parsed
          : this.merger(saveData, parsed);
        this.emit(result);
      }
      if (done) {
        break;
      }
    }
    this.event2Service.save(saveData);
    this.unSubscribe(); //done
  }
}
