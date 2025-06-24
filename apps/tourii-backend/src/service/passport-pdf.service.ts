import { PassportPdfRepository } from '@app/core/domain/passport/passport-pdf.repository';
import { R2StorageRepository } from '@app/core/domain/storage/r2-storage.repository';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Inject, Injectable, Logger } from '@nestjs/common';

export interface PassportPdfResult {
    tokenId: string;
    downloadUrl: string;
    qrCode: string;
    expiresAt: Date;
}

@Injectable()
export class PassportPdfService {
    private readonly logger = new Logger(PassportPdfService.name);

    constructor(
        @Inject('PASSPORT_PDF_REPOSITORY_TOKEN')
        private readonly passportPdfRepository: PassportPdfRepository,
        @Inject('R2_STORAGE_REPOSITORY_TOKEN')
        private readonly r2StorageRepository: R2StorageRepository,
    ) {}

    async generateAndUploadPdf(tokenId: string): Promise<PassportPdfResult> {
        try {
            this.logger.log(`Generating and uploading PDF for token ID: ${tokenId}`);

            // Validate token ID
            const isValid = await this.passportPdfRepository.validateTokenId(tokenId);
            if (!isValid) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
            }

            // Generate PDF
            const pdfData = await this.passportPdfRepository.generatePdf(tokenId);

            // Upload to R2
            const key = `passports/pdf/${tokenId}_${Date.now()}.pdf`;
            const downloadUrl = await this.r2StorageRepository.uploadPassportPdf(pdfData.pdfBuffer, key);

            this.logger.log(`PDF generated and uploaded successfully for token ID: ${tokenId}`);

            return {
                tokenId,
                downloadUrl,
                qrCode: pdfData.qrCode,
                expiresAt: pdfData.expiresAt
            };
        } catch (error) {
            this.logger.error(`Failed to generate PDF for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async generatePreview(tokenId: string): Promise<Buffer> {
        try {
            this.logger.log(`Generating PDF preview for token ID: ${tokenId}`);

            // Validate token ID
            const isValid = await this.passportPdfRepository.validateTokenId(tokenId);
            if (!isValid) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
            }

            return await this.passportPdfRepository.generatePreview(tokenId);
        } catch (error) {
            this.logger.error(`Failed to generate PDF preview for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async downloadPdf(tokenId: string): Promise<Buffer> {
        try {
            this.logger.log(`Generating PDF download for token ID: ${tokenId}`);

            // Validate token ID
            const isValid = await this.passportPdfRepository.validateTokenId(tokenId);
            if (!isValid) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
            }

            // Generate PDF on demand
            const pdfData = await this.passportPdfRepository.generatePdf(tokenId);
            return pdfData.pdfBuffer;
        } catch (error) {
            this.logger.error(`Failed to download PDF for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async validateToken(tokenId: string): Promise<boolean> {
        try {
            return await this.passportPdfRepository.validateTokenId(tokenId);
        } catch (error) {
            this.logger.error(`Failed to validate token ID ${tokenId}:`, error);
            return false;
        }
    }

    async refreshPdf(tokenId: string): Promise<PassportPdfResult> {
        try {
            this.logger.log(`Refreshing PDF for token ID: ${tokenId}`);
            
            // This is the same as generate and upload, but with explicit refresh intent
            return await this.generateAndUploadPdf(tokenId);
        } catch (error) {
            this.logger.error(`Failed to refresh PDF for token ID ${tokenId}:`, error);
            throw error;
        }
    }
}