/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import axios from 'axios';

@Injectable()
export class KeepAliveService {
  // EVERY 1 MINUTE
  @Cron('*/1 * * * *')
  async keepServerAlive() {
    try {
      console.log('KEEP ALIVE STARTED');

      const response = await axios.get(
        'https://healthtrackingapp-mv1w.onrender.com/',
      );

      console.log('SERVER IS AWAKE:', response.status);
    } catch (error: any) {
      console.log('KEEP ALIVE ERROR:', error.message);
    }
  }
}
