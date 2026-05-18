/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import axios from 'axios';

@Injectable()
export class KeepAliveService {
  // EVERY 10 MINUTES
  @Cron('*/10 * * * *')
  async keepServerAlive() {
    try {
      console.log('KEEP ALIVE STARTED');

      const response = await axios.get(
        'https://YOUR-RENDER-URL.onrender.com/ping',
      );

      console.log('SERVER IS AWAKE:', response.status);
    } catch (error: any) {
      console.log('KEEP ALIVE ERROR:', error.message);
    }
  }
}
