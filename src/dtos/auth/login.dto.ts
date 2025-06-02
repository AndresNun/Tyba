// List of Imports
import { IsEmail, IsNotEmpty } from "class-validator";

/**
 * Login validations
 */
export class LoginDto {

    /**
     * User's email
     */
    @IsEmail()
    email!: string;

    /**
     * User's hash password
     */
    @IsNotEmpty()
    password!: string;
}