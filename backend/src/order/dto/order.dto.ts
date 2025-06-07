//TODO реализовать DTO для /orders
import {
  IsString,
  IsNumber,
  IsEmail,
  IsArray,
  IsPhoneNumber,
} from 'class-validator';

export class GetTicketDTO {
  @IsString()
  film: string;
  @IsString()
  session: string;
  @IsString()
  daytime: string;
  @IsString()
  day: string;
  @IsString()
  time: string;
  @IsNumber()
  row: number;
  @IsNumber()
  seat: number;
  @IsNumber()
  price: number;
}

export class GetOrderDTO {
  @IsArray()
  tickets: GetTicketDTO[];
  @IsEmail()
  email: string;
  @IsPhoneNumber()
  phone: string;
}
