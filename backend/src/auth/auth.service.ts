/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { BadRequestException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { FirebaseService } from 'src/firebase/firebase.service';

import { UpdateBodyTypeDto } from './dto/update-body-type.dto';

import { BasicDetailsDto } from './dto/basic-details.dto';

import { PasswordSetupDto } from './dto/password-setup.dto';

import { VerifyOtpDto } from './dto/verify-otp.dto';

import { UpdateDetailsDto } from './dto/update-details.dto';

import { LoginDto } from './dto/login.dto';

import { otpStore, tempUserStore } from './auth.store';

import { generateOtp } from 'src/utils/generateOtp';

import { sendOtp } from 'src/utils/senOtp';

import { hashPassword } from 'src/utils/hashPassword';

import { comparedPassword } from 'src/utils/comparedPassowrd';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,

    private readonly jwtService: JwtService,
  ) {}

  // STEP 1
  async registerTemp(basicDetailsDto: BasicDetailsDto) {
    try {
      console.log('REGISTER TEMP STARTED');

      const { firstName, lastName, email } = basicDetailsDto;

      console.log('Received:', {
        firstName,
        lastName,
        email,
      });

      // CHECK USER
      const existingUser = await this.firebaseService.getUserByEmail(email);

      console.log('Existing User:', existingUser);

      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      // STORE TEMP USER
      tempUserStore.set(email, {
        firstName,
        lastName,
        email,
      });

      console.log('✅ TEMP USER STORED');

      return {
        success: true,

        message: 'Temporary registration successful',
      };
    } catch (error) {
      console.log('REGISTER TEMP ERROR:', error);

      throw error;
    }
  }

  // STEP 2
  async sendOtp(passwordSetupDto: PasswordSetupDto) {
    try {
      console.log('SEND OTP STARTED');

      const { email, password, confirmPassword } = passwordSetupDto;

      // PASSWORD MATCH
      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      console.log('✅ Passwords matched');

      // CHECK TEMP USER
      const tempUser = tempUserStore.get(email);

      console.log('Temp User:', tempUser);

      if (!tempUser) {
        throw new BadRequestException('Temporary user not found');
      }

      // GENERATE OTP
      const otp = generateOtp();

      console.log('Generated OTP:', otp);

      // STORE OTP
      otpStore.set(email, {
        otp,
        password,
        verified: false,
      });

      console.log('✅ OTP STORED');

      // SEND EMAIL
      await sendOtp(email, otp);

      console.log('✅ OTP SENT SUCCESSFULLY');

      return {
        success: true,

        message: 'OTP sent successfully',
      };
    } catch (error) {
      console.log('SEND OTP ERROR:', error);

      throw error;
    }
  }

  // STEP 3
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      console.log('VERIFY OTP STARTED');

      const { email, otp } = verifyOtpDto;

      // GET OTP DATA
      const storedOtp = otpStore.get(email);

      console.log('Stored OTP:', storedOtp);

      if (!storedOtp) {
        throw new BadRequestException('OTP expired');
      }

      // CHECK OTP
      if (storedOtp.otp !== otp) {
        throw new BadRequestException('Invalid OTP');
      }

      console.log('✅ OTP VERIFIED SUCCESSFULLY');

      // GET TEMP USER
      const tempUser = tempUserStore.get(email);

      console.log('TEMP USER:', tempUser);

      if (!tempUser) {
        throw new BadRequestException('Temporary user not found');
      }

      // HASH PASSWORD
      const hashedPassword = await hashPassword(storedOtp.password);

      console.log('✅ PASSWORD HASHED');

      // CREATE USER OBJECT
      const userData = {
        firstName: tempUser.firstName,

        lastName: tempUser.lastName,

        email,

        password: hashedPassword,

        age: null,

        weight: null,

        height: null,

        bodyType: null,

        createdAt: new Date(),
      };

      console.log('FINAL USER DATA:', userData);

      // SAVE USER IN FIREBASE
      const userId = await this.firebaseService.createUser(userData);

      console.log('✅ FIREBASE USER CREATED');

      console.log('🆔 USER ID:', userId);

      // GENERATE JWT TOKEN
      const token = this.jwtService.sign({
        userId,
        email,
      });

      console.log('✅ TOKEN GENERATED');

      // CLEAR TEMP STORES
      tempUserStore.delete(email);

      otpStore.delete(email);

      console.log('✅ TEMP STORES CLEARED');

      return {
        success: true,

        message: 'OTP verified & user registered successfully',

        token,

        user: {
          id: userId,

          firstName: tempUser.firstName,

          lastName: tempUser.lastName,

          email,
        },
      };
    } catch (error) {
      console.log('VERIFY OTP ERROR:', error);

      throw error;
    }
  }

  // UPDATE DETAILS
  async updateDetails(
    userId: string,

    updateDetailsDto: UpdateDetailsDto,
  ) {
    try {
      console.log('UPDATE DETAILS STARTED');

      console.log('USER ID:', userId);

      console.log('DETAILS:', updateDetailsDto);

      await this.firebaseService.updateUser(userId, {
        age: updateDetailsDto.age,

        weight: updateDetailsDto.weight,

        height: updateDetailsDto.height,
      });

      console.log('✅ DETAILS UPDATED');

      return {
        success: true,

        message: 'User details updated successfully',
      };
    } catch (error) {
      console.log('UPDATE DETAILS ERROR:', error);

      throw error;
    }
  }

  // UPDATE BODY TYPE
  async updateBodyType(
    userId: string,

    updateBodyTypeDto: UpdateBodyTypeDto,
  ) {
    try {
      console.log('UPDATE BODY TYPE STARTED');

      console.log('USER ID:', userId);

      console.log('BODY TYPE:', updateBodyTypeDto);

      await this.firebaseService.updateUser(userId, {
        bodyType: updateBodyTypeDto.bodyType,
      });

      console.log('✅ BODY TYPE UPDATED');

      return {
        success: true,

        message: 'Body type updated successfully',
      };
    } catch (error) {
      console.log('UPDATE BODY TYPE ERROR:', error);

      throw error;
    }
  }

  // LOGIN
  async login(loginDto: LoginDto) {
    try {
      console.log('LOGIN STARTED');

      const { email, password } = loginDto;

      console.log('LOGIN DATA:', {
        email,
        password,
      });

      // CHECK USER
      const user = await this.firebaseService.getUserByEmail(email);

      console.log('FOUND USER:', user);

      // USER NOT FOUND
      if (!user) {
        throw new BadRequestException('User does not exist');
      }

      // CHECK PASSWORD
      const isPasswordValid = await comparedPassword(password, user.password);

      console.log('PASSWORD MATCH:', isPasswordValid);

      // WRONG PASSWORD
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      // GENERATE TOKEN
      const token = this.jwtService.sign({
        userId: user.id,

        email: user.email,
      });

      console.log('✅ LOGIN SUCCESSFUL');

      console.log('✅ TOKEN GENERATED');

      return {
        success: true,

        message: 'Login successful',

        token,

        user: {
          id: user.id,

          firstName: user.firstName,

          lastName: user.lastName,

          email: user.email,

          age: user.age,

          weight: user.weight,

          height: user.height,

          bodyType: user.bodyType,
        },
      };
    } catch (error) {
      console.log('LOGIN ERROR:', error);

      throw error;
    }
  }
  // GET PROFILE
  async getProfile(userId: string) {
    try {
      console.log('GET PROFILE STARTED');

      // GET USER
      const user = await this.firebaseService.getUserById(userId);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // TIME BASED GREETING
      const currentHour = new Date().getHours();

      let greeting = 'Good Evening';

      if (currentHour >= 5 && currentHour < 12) {
        greeting = 'Good Morning';
      } else if (currentHour >= 12 && currentHour < 17) {
        greeting = 'Good Afternoon';
      } else {
        greeting = 'Good Evening';
      }

      console.log('GREETING:', greeting);

      // RANDOM PROFILE IMAGE
      const randomImage = `https://images.unsplash.com/photo-1500648767791-00dcc994a43e`;

      console.log('✅ PROFILE FETCHED');

      return {
        success: true,

        greeting,

        profileImage: randomImage,

        user: {
          id: user.id,

          firstName: user.firstName,

          lastName: user.lastName,

          email: user.email,

          age: user.age,

          weight: user.weight,

          height: user.height,

          bodyType: user.bodyType,
        },
      };
    } catch (error) {
      console.log('GET PROFILE ERROR:', error);

      throw error;
    }
  }
}
