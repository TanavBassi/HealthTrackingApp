import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsNumber()
  age!: number;

  @IsString()
  gender!: string;

  @IsNumber()
  weight!: number;

  @IsNumber()
  height!: number;
}
