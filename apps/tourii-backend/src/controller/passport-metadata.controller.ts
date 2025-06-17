import { Controller, Get, Param, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PassportMetadataService } from '../service/passport-metadata.service';
import { DigitalPassportMetadata } from '@app/core/domain/passport/digital-passport-metadata';

@ApiTags('passport-metadata')
@Controller('api/passport/metadata')
export class PassportMetadataController {
    private readonly logger = new Logger(PassportMetadataController.name);

    constructor(private readonly passportMetadataService: PassportMetadataService) {}

    @Get(':tokenId')
    @ApiOperation({
        summary: 'Get Digital Passport Metadata',
        description: 'Retrieve dynamic metadata for a Digital Passport NFT by token ID. This endpoint is called by NFT marketplaces and wallets to display passport information.',
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
                description: { type: 'string', example: 'Tourii Digital Passport for alice. This passport grants access to exclusive travel experiences and tracks your journey through Japan\'s hidden gems.' },
                image: { type: 'string', example: 'https://assets.tourii.com/passport/bonjin/bonjin.png' },
                external_url: { type: 'string', example: 'https://tourii.com/passport/123' },
                attributes: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            trait_type: { type: 'string', example: 'Passport Type' },
                            value: { type: 'string', example: 'Bonjin' },
                            display_type: { type: 'string', example: 'number', required: false },
                            max_value: { type: 'number', required: false },
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Digital Passport not found',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Digital Passport with token ID 123 not found' },
                error: { type: 'string', example: 'Not Found' },
                statusCode: { type: 'number', example: 404 },
            },
        },
    })
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
            
            throw new HttpException(
                `Failed to retrieve metadata for token ID ${tokenId}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}