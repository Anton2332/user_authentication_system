import { IsNotEmpty, IsString } from 'class-validator';
export class TokenDTO {
  @IsNotEmpty()
  @IsString()
  token: string;
}
