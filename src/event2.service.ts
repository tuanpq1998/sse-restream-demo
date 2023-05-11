import { Injectable } from '@nestjs/common';

@Injectable()
export class Event2Service {
  constructor() {
    // Inject some Service here and everything about SSE will stop to work.
  }

  getUserFakeInfo() {
    return {
      user: {
        name: 'Tuan',
      },
    };
  }

  save(obj) {
    console.log('save OBj', { obj });

    return true;
  }
}
