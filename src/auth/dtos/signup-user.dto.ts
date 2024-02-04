import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
export class SignUpUserDTO {
  @IsNotEmpty({ message: 'Enter Username' })
  @IsString({ message: 'Enter Valid Username' })
  @Length(5, 50, {
    message: 'Username length must be between 5 and 50 characters',
  })
  username: string;

  @IsNotEmpty({ message: 'Enter Password' })
  @IsString({ message: 'Enter Valid Password' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,50})/, {
    message:
      'Password length must be between 8 and 50 characters and must contain letter, number and symbol(!@#$%^&*).',
  })
  password: string;

  @IsNotEmpty({ message: 'Enter Full Name' })
  @IsString({ message: 'Enter Valid Full Name' })
  @Length(5, 50, {
    message: 'Full Name length must be between 5 and 50 characters',
  })
  fullName: string;
}
