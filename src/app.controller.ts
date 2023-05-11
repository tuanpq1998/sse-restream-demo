import {
  Controller,
  Get,
  Request,
  MessageEvent,
  Res,
  Sse,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { timer, Observable, take } from 'rxjs';
import { Response } from 'express';
import { map } from 'rxjs/operators';
import { EventsService } from './event.service';

@Controller()
export class AppController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Get('index2')
  index2(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index2.html')).toString());
  }

  TEXT_ARR =
    'RxJS features many operators that are simply shortcuts for other operators'.split(
      '',
    );

  // chatGPT server
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    console.log('sse');
    const text = this.TEXT_ARR;
    text.push('[DONE]');
    const subser = timer(0, 50).pipe(
      take(text.length), // 30 lan
      map((v, index) => {
        console.log({ index });
        return {
          data:
            // text[index],
            // { text: text[index] },
            {
              halfDynamicText: {
                text: text[index],
                static: 'some static',
              },
              staticData: 'foobar',
            },
          someStaticData: [1, 2, 3, 4], //out
          anotherStatic: 'hello world', //out
        } as MessageEvent;
      }),
    );
    // subser.subscribe();
    return subser;
  }

  @Sse('sse-restream')
  events(@Request() req, @Res() response: Response) {
    console.log('sse-restream');
    this.restream(req, response);
    // if (response.destroyed) this.eventsService.unSubscribe();
    return this.eventsService.subscribe();
  }

  // @Sse('sse-restream')
  async restream(@Request() req, @Res() response: Response): Promise<any> {
    await this.eventsService.peformRestream();
  }
}
