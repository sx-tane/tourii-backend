import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object, {
            whitelist: true, // Strip unknown properties
            forbidNonWhitelisted: true, // Throw error if unknown properties exist
            forbidUnknownValues: true, // Throw error for unknown nested objects
        });

        if (errors.length > 0) {
            const messages = errors.map((error) => ({
                property: error.property,
                constraints: error.constraints,
            }));
            throw new BadRequestException({
                message: 'Validation failed',
                errors: messages,
            });
        }

        return object;
    }

    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    private toValidate(metatype: any): boolean {
        // biome-ignore lint/complexity/noBannedTypes: <explanation>
        const types: any[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
