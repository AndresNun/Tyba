// List of Imports
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
    
    /**
     * User's username
     */
    @IsNotEmpty()
    @Length(3, 20)
    username!: string;

    /**
     * User's email
     */
    @IsEmail()
    email!: string;

    /**
     * User's hash password
     */
    @IsNotEmpty()
    @Length(6, 100)
    password!: string;   
}

