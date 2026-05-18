import { Body, Controller, Param, Patch, Post, Get } from '@nestjs/common';

import { AuthService } from './auth.service';

import { BasicDetailsDto } from './dto/basic-details.dto';
import { PasswordSetupDto } from './dto/password-setup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

import { UpdateDetailsDto } from './dto/update-details.dto';
import { UpdateBodyTypeDto } from './dto/update-body-type.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // STEP 1
  @Post('register-temp')
  async registerTemp(@Body() basicDetailsDto: BasicDetailsDto) {
    return this.authService.registerTemp(basicDetailsDto);
  }

  // STEP 2
  @Post('send-otp')
  async sendOtp(
    @Body()
    passwordSetupDto: PasswordSetupDto,
  ) {
    return this.authService.sendOtp(passwordSetupDto);
  }

  // STEP 3
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Patch('update-details/:userId')
  async updateDetails(
    @Param('userId')
    userId: string,

    @Body()
    updateDetailsDto: UpdateDetailsDto,
  ) {
    console.log('UPDATE DETAILS API HIT');
    return this.authService.updateDetails(userId, updateDetailsDto);
  }

  // UPDATE BODY TYPE
  @Patch('update-body-type/:userId')
  async updateBodyType(
    @Param('userId')
    userId: string,

    @Body()
    updateBodyTypeDto: UpdateBodyTypeDto,
  ) {
    console.log('UPDATE BODY TYPE API HIT');

    return this.authService.updateBodyType(userId, updateBodyTypeDto);
  }

  // LOGIN
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('LOGIN API HIT');

    return this.authService.login(loginDto);
  }

  // GET PROFILE
  @Get('profile/:userId')
  async getProfile(
    @Param('userId')
    userId: string,
  ) {
    console.log('GET PROFILE API HIT');

    return this.authService.getProfile(userId);
  }
}
