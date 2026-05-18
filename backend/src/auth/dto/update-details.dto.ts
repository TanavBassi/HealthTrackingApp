import { IsNumber } from 'class-validator';

export class UpdateDetailsDto {
  @IsNumber()
  age!: number;

  @IsNumber()
  weight!: number;

  @IsNumber()
  height!: number;
}
