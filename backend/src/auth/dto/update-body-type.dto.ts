import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBodyTypeDto {
  @IsString()
  @IsNotEmpty()
  bodyType: string;
}
