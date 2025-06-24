import { PassportPdfService, PassportPdfResult } from '../service/passport-pdf.service';
import { PassportMetadataService } from '../../../tourii-onchain/src/service/passport-metadata.service';
import {
    Controller,
    Get,
    Post,
    Param,
    Res,
    HttpException,
    HttpStatus,
    Logger,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';

@ApiTags('passport-generation')
@Controller('api/passport')
@UseGuards(ThrottlerGuard)
export class PassportGenerationController {
    private readonly logger = new Logger(PassportGenerationController.name);

    constructor(
        private readonly passportPdfService: PassportPdfService,
        private readonly passportMetadataService: PassportMetadataService,
    ) {}

    @Post('generate/:tokenId')
    @ApiOperation({
        summary: 'Generate Digital Passport PDF',
        description: 'Generate a professional PDF passport document with user achievements and QR code verification. Uploads to cloud storage and returns download URL.',
    })
    @ApiResponse({
        status: 201,
        description: 'Passport PDF generated and uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                tokenId: { type: 'string', example: '123' },
                downloadUrl: { type: 'string', example: 'https://assets.tourii.com/passports/pdf/123_1640995200000.pdf' },
                qrCode: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                expiresAt: { type: 'string', format: 'date-time', example: '2024-01-01T12:00:00.000Z' },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid token ID',
    })
    @ApiResponse({
        status: 404,
        description: 'Passport not found',
    })
    async generatePdf(@Param('tokenId') tokenId: string): Promise<PassportPdfResult> {
        try {
            this.logger.log(`Generating PDF passport for token ID: ${tokenId}`);
            
            const result = await this.passportPdfService.generateAndUploadPdf(tokenId);
            
            this.logger.log(`PDF generated successfully for token ID: ${tokenId}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to generate PDF for token ID ${tokenId}:`, error);
            
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new HttpException(
                `Failed to generate PDF for token ID ${tokenId}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get(':tokenId')
    @ApiOperation({
        summary: 'Get Passport Metadata',
        description: 'Retrieve passport metadata (existing endpoint from onchain service)',
    })
    @ApiParam({
        name: 'tokenId',
        description: 'The token ID of the Digital Passport NFT',
        example: '123',
    })
    @ApiResponse({
        status: 200,
        description: 'Passport metadata retrieved successfully',
    })
    async getPassportMetadata(@Param('tokenId') tokenId: string) {
        try {
            this.logger.log(`Fetching metadata for passport token ID: ${tokenId}`);
            return await this.passportMetadataService.getMetadata(tokenId);
        } catch (error) {
            this.logger.error(`Failed to get metadata for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    @Post('refresh/:tokenId')
    @ApiOperation({
        summary: 'Refresh Passport with New Achievements',
        description: 'Regenerate passport PDF with updated user achievements and progress',
    })
    @ApiParam({
        name: 'tokenId',
        description: 'The token ID of the Digital Passport NFT',
        example: '123',
    })
    @ApiResponse({
        status: 200,
        description: 'Passport refreshed successfully',
    })
    async refreshPassport(@Param('tokenId') tokenId: string): Promise<PassportPdfResult> {
        try {
            this.logger.log(`Refreshing passport for token ID: ${tokenId}`);
            
            const result = await this.passportPdfService.refreshPdf(tokenId);
            
            this.logger.log(`Passport refreshed successfully for token ID: ${tokenId}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to refresh passport for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    @Get('preview/:tokenId')
    @ApiOperation({
        summary: 'Generate Passport Preview',
        description: 'Generate a preview PDF without uploading to storage (for testing/preview purposes)',
    })
    @ApiParam({
        name: 'tokenId',
        description: 'The token ID of the Digital Passport NFT',
        example: '123',
    })
    @ApiResponse({
        status: 200,
        description: 'Preview PDF generated successfully',
        content: {
            'application/pdf': {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async generatePreview(@Param('tokenId') tokenId: string, @Res() res: Response): Promise<void> {
        try {
            this.logger.log(`Generating preview for token ID: ${tokenId}`);
            
            const pdfBuffer = await this.passportPdfService.generatePreview(tokenId);
            
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="passport-preview-${tokenId}.pdf"`,
                'Content-Length': pdfBuffer.length.toString(),
            });
            
            res.send(pdfBuffer);
            
            this.logger.log(`Preview generated successfully for token ID: ${tokenId}`);
        } catch (error) {
            this.logger.error(`Failed to generate preview for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    @Post('download/:tokenId')
    @ApiOperation({
        summary: 'Download Passport PDF',
        description: 'Generate and directly download passport PDF (generates on-demand)',
    })
    @ApiParam({
        name: 'tokenId',
        description: 'The token ID of the Digital Passport NFT',
        example: '123',
    })
    @ApiResponse({
        status: 200,
        description: 'PDF downloaded successfully',
        content: {
            'application/pdf': {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async downloadPdf(@Param('tokenId') tokenId: string, @Res() res: Response): Promise<void> {
        try {
            this.logger.log(`Downloading PDF for token ID: ${tokenId}`);
            
            const pdfBuffer = await this.passportPdfService.downloadPdf(tokenId);
            
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="tourii-passport-${tokenId}.pdf"`,
                'Content-Length': pdfBuffer.length.toString(),
            });
            
            res.send(pdfBuffer);
            
            this.logger.log(`PDF downloaded successfully for token ID: ${tokenId}`);
        } catch (error) {
            this.logger.error(`Failed to download PDF for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    @Get('validate/:tokenId')
    @ApiOperation({
        summary: 'Validate Token ID',
        description: 'Check if a token ID exists and is valid for passport generation',
    })
    @ApiParam({
        name: 'tokenId',
        description: 'The token ID to validate',
        example: '123',
    })
    @ApiResponse({
        status: 200,
        description: 'Token validation result',
        schema: {
            type: 'object',
            properties: {
                valid: { type: 'boolean', example: true },
                tokenId: { type: 'string', example: '123' },
            },
        },
    })
    async validateToken(@Param('tokenId') tokenId: string): Promise<{ valid: boolean; tokenId: string }> {
        try {
            this.logger.log(`Validating token ID: ${tokenId}`);
            
            const valid = await this.passportPdfService.validateToken(tokenId);
            
            return { valid, tokenId };
        } catch (error) {
            this.logger.error(`Failed to validate token ID ${tokenId}:`, error);
            return { valid: false, tokenId };
        }
    }
}