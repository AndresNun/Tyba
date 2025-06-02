// List of Imports
import { Type } from 'class-transformer';
import { TransactionType } from '@common/enums/transaction-type.enum';
import { IsEnum, IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';

/**
 * Transactions validations
 */
export class TransactionDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    /**
     * User ID (Foreign key)
     */
    @IsNumber()
    userId!: number;

    /**
     * Transaction type
     */
    @IsEnum(TransactionType)
    type!: TransactionType;

    /**
     * Location: City's name
     */
    @IsOptional()
    @IsString()
    location?: string;

    /**
     * Latitude
     */
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    latitude?: number;

    /**
     * Longitude
     */
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    longitude?: number;

    /**
     * Transaction creation date
     */
    @IsDateString()
    createdAt?: string;
}