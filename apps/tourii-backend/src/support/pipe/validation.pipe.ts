import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';

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
            throw new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_047,
                { statusCode: 400 }
            );
        }

        return object;
    }

    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    private toValidate(metatype: Function): boolean {
        // biome-ignore lint/complexity/noBannedTypes: <explanation>
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
