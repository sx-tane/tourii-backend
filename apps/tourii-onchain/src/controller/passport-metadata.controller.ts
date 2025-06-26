import { DigitalPassportMetadata } from '@app/core/domain/passport/digital-passport-metadata';
import {
    Controller,
    Get,
    HttpException,
    Logger,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PassportMetadataService } from '../service/passport-metadata.service';
import {
    ApiInvalidVersionResponse,
    ApiResourceNotFoundResponse,
} from '../support/decorators/api-error-responses.decorator';
import { TouriiOnchainAppErrorType } from '../support/exception/tourii-onchain-app-error-type';
import { TouriiOnchainAppException } from '../support/exception/tourii-onchain-app-exception';

@ApiTags('passport-metadata')
@Controller('api/passport/metadata')
@UseGuards(ThrottlerGuard)
export class PassportMetadataController {
    private readonly logger = new Logger(PassportMetadataController.name);

    constructor(private readonly passportMetadataService: PassportMetadataService) {}

    @Get(':tokenId')
    @ApiOperation({
        summary: 'Get Digital Passport Metadata',
        description:
            'Retrieve dynamic metadata for a Digital Passport NFT by token ID. This endpoint is called by NFT marketplaces and wallets to display passport information.',
    })
    @ApiParam({
        name: 'tokenId',
        description: 'The token ID of the Digital Passport NFT',
        example: '123',
    })
    @ApiResponse({
        status: 200,
        description: 'Digital Passport metadata retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Bonjin Digital Passport #123' },
                description: {
                    type: 'string',
                    example:
                        "Tourii Digital Passport for alice. This passport grants access to exclusive travel experiences and tracks your journey through Japan's hidden gems.",
                },
                image: {
                    type: 'string',
                    example: 'https://assets.tourii.com/passport/bonjin/bonjin.png',
                },
                external_url: { type: 'string', example: 'https://tourii.com/passport/123' },
                attributes: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['trait_type', 'value'],
                        properties: {
                            trait_type: { type: 'string', example: 'Passport Type' },
                            value: { type: 'string', example: 'Bonjin' },
                            display_type: { type: 'string', example: 'number' },
                            max_value: { type: 'number', example: 100 },
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Digital Passport not found',
    })
    @ApiResourceNotFoundResponse()
    @ApiInvalidVersionResponse()
    async getMetadata(@Param('tokenId') tokenId: string): Promise<DigitalPassportMetadata> {
        try {
            this.logger.log(`Fetching metadata for passport token ID: ${tokenId}`);

            const metadata = await this.passportMetadataService.getMetadata(tokenId);

            this.logger.log(`Successfully retrieved metadata for passport token ID: ${tokenId}`);
            return metadata;
        } catch (error) {
            this.logger.error(`Failed to retrieve metadata for token ID ${tokenId}:`, error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new TouriiOnchainAppException(TouriiOnchainAppErrorType.E_OC_002);
        }
    }
}
