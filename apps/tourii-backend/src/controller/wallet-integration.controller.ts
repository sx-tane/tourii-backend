import { WalletPassService, WalletPassResult, BothWalletPassesResult } from '../service/wallet-pass.service';
import {
    Controller,
    Get,
    Post,
    Param,
    Req,
    Res,
    Body,
    HttpException,
    HttpStatus,
    Logger,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';

interface UpdatePassRequest {
    tokenId: string;
    platform: 'apple' | 'google';
}

interface RevokePassRequest {
    tokenId: string;
    platform: 'apple' | 'google';
}

@ApiTags('wallet-integration')
@Controller('api/wallet')
@UseGuards(ThrottlerGuard)
export class WalletIntegrationController {
    private readonly logger = new Logger(WalletIntegrationController.name);

    constructor(private readonly walletPassService: WalletPassService) {}

    @Post('apple/pass')
    @ApiOperation({
        summary: 'Generate Apple Wallet Pass',
        description: 'Generate a .pkpass file for Apple Wallet with passport achievements and QR code',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                tokenId: { type: 'string', example: '123' },
            },
            required: ['tokenId'],
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Apple Wallet pass generated successfully',
        schema: {
            type: 'object',
            properties: {
                tokenId: { type: 'string', example: '123' },
                platform: { type: 'string', example: 'apple' },
                downloadUrl: { type: 'string', example: 'https://assets.tourii.com/passports/apple/123_1640995200000.pkpass' },
                redirectUrl: { type: 'string', example: 'https://assets.tourii.com/passports/apple/123_1640995200000.pkpass' },
                expiresAt: { type: 'string', format: 'date-time', example: '2024-01-08T12:00:00.000Z' },
            },
        },
    })
    async generateApplePass(@Body() body: { tokenId: string }): Promise<WalletPassResult> {
        try {
            this.logger.log(`Generating Apple Wallet pass for token ID: ${body.tokenId}`);
            
            const result = await this.walletPassService.generateApplePass(body.tokenId);
            
            this.logger.log(`Apple Wallet pass generated successfully for token ID: ${body.tokenId}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to generate Apple pass for token ID ${body.tokenId}:`, error);
            throw new HttpException(
                `Failed to generate Apple Wallet pass`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('google/pass')
    @ApiOperation({
        summary: 'Generate Google Pay Pass',
        description: 'Generate a Google Pay pass with passport achievements and QR code',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                tokenId: { type: 'string', example: '123' },
            },
            required: ['tokenId'],
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Google Pay pass generated successfully',
        schema: {
            type: 'object',
            properties: {
                tokenId: { type: 'string', example: '123' },
                platform: { type: 'string', example: 'google' },
                redirectUrl: { type: 'string', example: 'https://pay.google.com/gp/v/save/...' },
                expiresAt: { type: 'string', format: 'date-time', example: '2024-01-08T12:00:00.000Z' },
            },
        },
    })
    async generateGooglePass(@Body() body: { tokenId: string }): Promise<WalletPassResult> {
        try {
            this.logger.log(`Generating Google Pay pass for token ID: ${body.tokenId}`);
            
            const result = await this.walletPassService.generateGooglePass(body.tokenId);
            
            this.logger.log(`Google Pay pass generated successfully for token ID: ${body.tokenId}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to generate Google pass for token ID ${body.tokenId}:`, error);
            throw new HttpException(
                `Failed to generate Google Pay pass`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('auto/:tokenId')
    @ApiOperation({
        summary: 'Auto-Generate Platform-Specific Pass',
        description: 'Automatically detect device platform (iOS/Android) and generate appropriate wallet pass',
    })
    @ApiParam({
        name: 'tokenId',
        description: 'The token ID of the Digital Passport NFT',
        example: '123',
    })
    @ApiResponse({
        status: 200,
        description: 'Platform-specific pass generated successfully',
    })
    async generateAutoPass(@Param('tokenId') tokenId: string, @Req() req: Request): Promise<WalletPassResult> {
        try {
            this.logger.log(`Auto-generating wallet pass for token ID: ${tokenId}`);
            
            const userAgent = req.headers['user-agent'] || '';
            const result = await this.walletPassService.generateAutoPass(tokenId, userAgent);
            
            this.logger.log(`Auto-generated ${result.platform} pass successfully for token ID: ${tokenId}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to auto-generate pass for token ID ${tokenId}:`, error);
            throw new HttpException(
                `Failed to generate wallet pass`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('both/:tokenId')
    @ApiOperation({
        summary: 'Generate Both Platform Passes',
        description: 'Generate both Apple Wallet and Google Pay passes simultaneously',
    })
    @ApiParam({
        name: 'tokenId',
        description: 'The token ID of the Digital Passport NFT',
        example: '123',
    })
    @ApiResponse({
        status: 200,
        description: 'Both platform passes generated successfully',
        schema: {
            type: 'object',
            properties: {
                tokenId: { type: 'string', example: '123' },
                apple: {
                    type: 'object',
                    properties: {
                        tokenId: { type: 'string', example: '123' },
                        platform: { type: 'string', example: 'apple' },
                        downloadUrl: { type: 'string' },
                        redirectUrl: { type: 'string' },
                        expiresAt: { type: 'string', format: 'date-time' },
                    },
                },
                google: {
                    type: 'object',
                    properties: {
                        tokenId: { type: 'string', example: '123' },
                        platform: { type: 'string', example: 'google' },
                        redirectUrl: { type: 'string' },
                        expiresAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    })
    async generateBothPasses(@Param('tokenId') tokenId: string): Promise<BothWalletPassesResult> {
        try {
            this.logger.log(`Generating both wallet passes for token ID: ${tokenId}`);
            
            const result = await this.walletPassService.generateBothPasses(tokenId);
            
            this.logger.log(`Both wallet passes generated successfully for token ID: ${tokenId}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to generate both passes for token ID ${tokenId}:`, error);
            throw new HttpException(
                `Failed to generate wallet passes`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('update')
    @ApiOperation({
        summary: 'Update Existing Wallet Pass',
        description: 'Push updates to existing wallet pass when user earns new achievements',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                tokenId: { type: 'string', example: '123' },
                platform: { type: 'string', enum: ['apple', 'google'], example: 'apple' },
            },
            required: ['tokenId', 'platform'],
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Wallet pass updated successfully',
    })
    async updatePass(@Body() body: UpdatePassRequest): Promise<WalletPassResult> {
        try {
            this.logger.log(`Updating ${body.platform} pass for token ID: ${body.tokenId}`);
            
            const result = await this.walletPassService.updatePass(body.tokenId, body.platform);
            
            this.logger.log(`${body.platform} pass updated successfully for token ID: ${body.tokenId}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to update ${body.platform} pass for token ID ${body.tokenId}:`, error);
            throw new HttpException(
                `Failed to update wallet pass`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('revoke/:tokenId')
    @ApiOperation({
        summary: 'Revoke Wallet Pass Access',
        description: 'Revoke wallet pass access for security incidents or user requests',
    })
    @ApiParam({
        name: 'tokenId',
        description: 'The token ID of the Digital Passport NFT',
        example: '123',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                platform: { type: 'string', enum: ['apple', 'google'], example: 'apple' },
            },
            required: ['platform'],
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Wallet pass revoked successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                tokenId: { type: 'string', example: '123' },
                platform: { type: 'string', example: 'apple' },
                revokedAt: { type: 'string', format: 'date-time' },
            },
        },
    })
    async revokePass(
        @Param('tokenId') tokenId: string,
        @Body() body: { platform: 'apple' | 'google' },
    ): Promise<{ success: boolean; tokenId: string; platform: string; revokedAt: Date }> {
        try {
            this.logger.log(`Revoking ${body.platform} pass for token ID: ${tokenId}`);
            
            const success = await this.walletPassService.revokePass(tokenId, body.platform);
            
            this.logger.log(`${body.platform} pass revocation ${success ? 'successful' : 'failed'} for token ID: ${tokenId}`);
            
            return {
                success,
                tokenId,
                platform: body.platform,
                revokedAt: new Date(),
            };
        } catch (error) {
            this.logger.error(`Failed to revoke ${body.platform} pass for token ID ${tokenId}:`, error);
            throw new HttpException(
                `Failed to revoke wallet pass`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('status/:tokenId')
    @ApiOperation({
        summary: 'Check Pass Status',
        description: 'Check the status of wallet passes for a given token ID',
    })
    @ApiParam({
        name: 'tokenId',
        description: 'The token ID of the Digital Passport NFT',
        example: '123',
    })
    @ApiResponse({
        status: 200,
        description: 'Pass status retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                tokenId: { type: 'string', example: '123' },
                apple: { type: 'boolean', example: true },
                google: { type: 'boolean', example: true },
                checkedAt: { type: 'string', format: 'date-time' },
            },
        },
    })
    async getPassStatus(@Param('tokenId') tokenId: string): Promise<{
        tokenId: string;
        apple: boolean;
        google: boolean;
        checkedAt: Date;
    }> {
        try {
            this.logger.log(`Checking pass status for token ID: ${tokenId}`);
            
            const status = await this.walletPassService.getPassStatus(tokenId);
            
            return {
                tokenId,
                apple: status.apple,
                google: status.google,
                checkedAt: new Date(),
            };
        } catch (error) {
            this.logger.error(`Failed to get pass status for token ID ${tokenId}:`, error);
            return {
                tokenId,
                apple: false,
                google: false,
                checkedAt: new Date(),
            };
        }
    }

    @Get('detect-platform')
    @ApiOperation({
        summary: 'Detect Device Platform',
        description: 'Detect the client device platform (iOS/Android/Web) from User-Agent',
    })
    @ApiResponse({
        status: 200,
        description: 'Platform detected successfully',
        schema: {
            type: 'object',
            properties: {
                userAgent: { type: 'string', example: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)...' },
                platform: { type: 'string', enum: ['ios', 'android', 'web'], example: 'ios' },
                recommendedWallet: { type: 'string', enum: ['apple', 'google'], example: 'apple' },
            },
        },
    })
    async detectPlatform(@Req() req: Request): Promise<{
        userAgent: string;
        platform: string;
        recommendedWallet: string;
    }> {
        try {
            const userAgent = req.headers['user-agent'] || '';
            const deviceInfo = this.walletPassService.detectPlatform(userAgent);
            
            const recommendedWallet = deviceInfo.platform === 'ios' ? 'apple' : 'google';
            
            return {
                userAgent: deviceInfo.userAgent,
                platform: deviceInfo.platform,
                recommendedWallet,
            };
        } catch (error) {
            this.logger.error(`Failed to detect platform:`, error);
            throw new HttpException(
                `Failed to detect platform`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}