import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    FirebaseModule,

    JwtModule.register({
      secret: 'healthTrackingSecretKey',

      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService],
})
export class AuthModule {}
