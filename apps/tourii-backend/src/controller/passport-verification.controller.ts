import { 
    PassportVerificationService, 
    VerificationResult, 
    BatchVerificationRequest, 
    BatchVerificationResult,
    VerificationStats 
} from '../service/passport-verification.service';
import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Query,
    HttpException,
    HttpStatus,
    Logger,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('passport-verification')
@Controller('api/verify')
@UseGuards(ThrottlerGuard)
export class PassportVerificationController {
    private readonly logger = new Logger(PassportVerificationController.name);

    constructor(private readonly verificationService: PassportVerificationService) {}

    @Get(':verificationCode')
    @ApiOperation({
        summary: 'Verify Passport Token',
        description: 'Verify a passport verification token (from QR code or manual entry). Public endpoint requiring no authentication.',
    })
    @ApiParam({
        name: 'verificationCode',
        description: 'The verification token (JWT) from QR code or manual entry',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @ApiResponse({
        status: 200,
        description: 'Verification completed (check valid field for result)',
        schema: {
            type: 'object',
            properties: {
                valid: { type: 'boolean', example: true },
                tokenId: { type: 'string', example: '123' },
                verifiedAt: { type: 'string', format: 'date-time', example: '2024-01-01T12:00:00.000Z' },
                expiresAt: { type: 'string', format: 'date-time', example: '2024-01-02T12:00:00.000Z' },
                passportData: {
                    type: 'object',
                    properties: {
                        username: { type: 'string', example: 'alice' },
                        level: { type: 'string', example: 'E-Class Amatsukami' },
                        passportType: { type: 'string', example: 'Amatsukami' },
                        questsCompleted: { type: 'number', example: 15 },
                        travelDistance: { type: 'number', example: 250 },
                        magatamaPoints: { type: 'number', example: 1500 },
                        registeredAt: { type: 'string', format: 'date-time' },
                    },
                },
                error: { type: 'string', example: null },
            },
        },
    })
    async verifyPassport(@Param('verificationCode') verificationCode: string): Promise<VerificationResult> {
        try {
            this.logger.log(`Verifying passport with code: ${verificationCode.substring(0, 20)}...`);
            
            const result = await this.verificationService.verifyPassport(verificationCode);
            
            this.logger.log(`Verification ${result.valid ? 'successful' : 'failed'} for token ID: ${result.tokenId}`);
            return result;
        } catch (error) {
            this.logger.error(`Verification failed:`, error);
            
            // Don't throw HTTP exceptions for verification failures - return failed result instead
            return {
                valid: false,
                tokenId: 'unknown',
                verifiedAt: new Date(),
                error: 'Verification failed',
            };
        }
    }

    @Post('batch')
    @ApiOperation({
        summary: 'Batch Verify Multiple Passports',
        description: 'Verify multiple passport tokens at once. Useful for bulk verification scenarios.',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                tokens: {
                    type: 'array',
                    items: { type: 'string' },
                    example: [
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    ],
                },
            },
            required: ['tokens'],
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Batch verification completed',
        schema: {
            type: 'object',
            properties: {
                results: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            valid: { type: 'boolean' },
                            tokenId: { type: 'string' },
                            verifiedAt: { type: 'string', format: 'date-time' },
                            passportData: { type: 'object' },
                            error: { type: 'string' },
                        },
                    },
                },
                summary: {
                    type: 'object',
                    properties: {
                        total: { type: 'number', example: 2 },
                        valid: { type: 'number', example: 1 },
                        invalid: { type: 'number', example: 1 },
                    },
                },
            },
        },
    })
    async batchVerifyPassports(@Body() request: BatchVerificationRequest): Promise<BatchVerificationResult> {
        try {
            this.logger.log(`Batch verifying ${request.tokens.length} tokens`);
            
            const result = await this.verificationService.batchVerifyPassports(request);
            
            this.logger.log(`Batch verification completed: ${result.summary.valid}/${result.summary.total} valid`);
            return result;
        } catch (error) {
            this.logger.error(`Batch verification failed:`, error);
            throw new HttpException(
                'Batch verification failed',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('qr/:qrCode')
    @ApiOperation({
        summary: 'Verify QR Code',
        description: 'Verify a passport using QR code data. Alias for standard verification endpoint.',
    })
    @ApiParam({
        name: 'qrCode',
        description: 'The QR code data (JWT token)',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @ApiResponse({
        status: 200,
        description: 'QR code verification completed',
    })
    async verifyQrCode(@Param('qrCode') qrCode: string): Promise<VerificationResult> {
        try {
            this.logger.log(`Verifying QR code: ${qrCode.substring(0, 20)}...`);
            
            const result = await this.verificationService.verifyQrCode(qrCode);
            
            this.logger.log(`QR verification ${result.valid ? 'successful' : 'failed'} for token ID: ${result.tokenId}`);
            return result;
        } catch (error) {
            this.logger.error(`QR verification failed:`, error);
            
            return {
                valid: false,
                tokenId: 'unknown',
                verifiedAt: new Date(),
                error: 'QR code verification failed',
            };
        }
    }

    @Get('stats/:tokenId?')
    @ApiOperation({
        summary: 'Get Verification Statistics',
        description: 'Get verification statistics for a specific token ID or global stats if no token ID provided',
    })
    @ApiParam({
        name: 'tokenId',
        description: 'The token ID to get stats for (optional)',
        required: false,
        example: '123',
    })
    @ApiResponse({
        status: 200,
        description: 'Verification statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                tokenId: { type: 'string', example: '123' },
                totalVerifications: { type: 'number', example: 45 },
                todayVerifications: { type: 'number', example: 3 },
                lastVerified: { type: 'string', format: 'date-time', example: '2024-01-01T12:00:00.000Z' },
                popularPassports: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            tokenId: { type: 'string', example: '123' },
                            username: { type: 'string', example: 'alice' },
                            verificationCount: { type: 'number', example: 45 },
                        },
                    },
                },
            },
        },
    })
    async getVerificationStats(@Param('tokenId') tokenId?: string): Promise<VerificationStats> {
        try {
            this.logger.log(`Getting verification stats${tokenId ? ` for token ID: ${tokenId}` : ' (global)'}`);
            
            const stats = await this.verificationService.getVerificationStats(tokenId);
            
            this.logger.log(`Statistics retrieved successfully${tokenId ? ` for token ID: ${tokenId}` : ' (global)'}`);
            return stats;
        } catch (error) {
            this.logger.error(`Failed to get verification stats${tokenId ? ` for token ID: ${tokenId}` : ' (global)'}:`, error);
            throw new HttpException(
                'Failed to retrieve verification statistics',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}