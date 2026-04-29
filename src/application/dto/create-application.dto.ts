import { Transform } from "class-transformer"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"
import { Role } from "src/generated/prisma/enums"

export class CreateApplicationDto {
    @IsNotEmpty({ message: 'firstName not provided' })
    @IsString({ message: 'firstName must be string' })
    firstName!: string

    @IsNotEmpty({ message: 'lastName not provided' })
    @IsString({ message: 'lastName must be string' })
    lastName!: string

    @IsNotEmpty({ message: 'email must be provided' })
    @IsString({ message: 'email must be string' })
    @Transform(({ value }) => value?.trim().toLowerCase())
    email!: string

    @IsNotEmpty({ message: 'phone number not provided' })
    @IsString({ message: 'phone number must be string' })
    phone!: string

    @IsEnum(Role, { message: 'role must be a valid Role enum value' })
    @Transform(({ value }) => value ? value : Role.CANDIDATE)
    role!: Role
}
