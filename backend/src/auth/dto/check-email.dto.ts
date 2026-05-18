import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CheckEmailDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;
}
