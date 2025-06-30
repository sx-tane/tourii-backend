import { JwtRepository } from '@app/core/domain/auth/jwt.repository';
import {
    DigitalPassportMetadata,
    PassportAttribute,
} from '@app/core/domain/passport/digital-passport-metadata';
import { PassportMetadataRepository } from '@app/core/domain/passport/passport-metadata.repository';
import {
    PassportPdfData,
    PassportPdfRepository,
} from '@app/core/domain/passport/passport-pdf.repository';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as puppeteer from 'puppeteer';
import * as QRCode from 'qrcode';

@Injectable()
export class PassportPdfRepositoryImpl implements PassportPdfRepository {
    private readonly logger = new Logger(PassportPdfRepositoryImpl.name);
    private readonly pdfQrTokenExpirationHours: number;

    constructor(
        @Inject('PASSPORT_METADATA_REPOSITORY_TOKEN')
        private readonly passportMetadataRepository: PassportMetadataRepository,
        @Inject('JWT_REPOSITORY_TOKEN')
        private readonly jwtRepository: JwtRepository,
        private readonly config: ConfigService,
    ) {
        // Default to 24 hours if not configured
        this.pdfQrTokenExpirationHours =
            this.config.get<number>('PASSPORT_PDF_QR_TOKEN_EXPIRATION_HOURS') || 24;
    }

    async generatePdf(tokenId: string): Promise<PassportPdfData> {
        try {
            this.logger.log(`Generating PDF passport for token ID: ${tokenId}`);

            // TODO: Remove this hardcoded mock and implement proper metadata generation
            // This is a temporary solution for testing without database setup
            if (this.isMockTokenId(tokenId)) {
                this.logger.log(
                    `Using hardcoded mock response for PDF passport token ID: ${tokenId}`,
                );

                // Generate QR code token for mock
                const qrToken = this.jwtRepository.generateQrToken(
                    tokenId,
                    this.pdfQrTokenExpirationHours,
                );

                // Generate QR code image
                const qrCodeDataUrl = await QRCode.toDataURL(qrToken, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF',
                    },
                });

                // Get mock metadata based on token ID
                const mockMetadata = this.getMockMetadata(tokenId);

                // Generate PDF with mock data
                const pdfBuffer = await this.generatePdfFromTemplate(
                    mockMetadata,
                    qrCodeDataUrl,
                    tokenId,
                );

                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 24);

                return {
                    tokenId,
                    pdfBuffer,
                    qrCode: qrToken,
                    expiresAt,
                };
            }

            // Generate QR code token
            const qrToken = this.jwtRepository.generateQrToken(
                tokenId,
                this.pdfQrTokenExpirationHours,
            );

            // Generate QR code image
            const qrCodeDataUrl = await QRCode.toDataURL(qrToken, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                },
            });

            // Get passport metadata
            const metadata = await this.passportMetadataRepository.generateMetadata(tokenId);

            // Generate PDF
            const pdfBuffer = await this.generatePdfFromTemplate(metadata, qrCodeDataUrl, tokenId);

            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + this.pdfQrTokenExpirationHours);

            return {
                tokenId,
                pdfBuffer,
                qrCode: qrToken,
                expiresAt,
            };
        } catch (error) {
            this.logger.error(`Failed to generate PDF for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async generatePreview(tokenId: string): Promise<Buffer> {
        try {
            this.logger.log(`Generating PDF preview for token ID: ${tokenId}`);

            // Generate temporary QR code for preview
            const tempQrCode = await QRCode.toDataURL(`preview-${tokenId}`, {
                width: 200,
                margin: 2,
            });

            // Get passport metadata
            const metadata = await this.passportMetadataRepository.generateMetadata(tokenId);

            // Generate PDF
            return await this.generatePdfFromTemplate(metadata, tempQrCode, tokenId);
        } catch (error) {
            this.logger.error(`Failed to generate PDF preview for token ID ${tokenId}:`, error);
            throw error;
        }
    }

    async validateTokenId(tokenId: string): Promise<boolean> {
        try {
            await this.passportMetadataRepository.generateMetadata(tokenId);
            return true;
        } catch {
            return false;
        }
    }

    private async generatePdfFromTemplate(
        metadata: DigitalPassportMetadata,
        qrCodeDataUrl: string,
        tokenId: string,
    ): Promise<Buffer> {
        let browser: puppeteer.Browser | null = null;

        try {
            // Launch browser
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });

            const page = await browser.newPage();

            // Generate HTML template
            const html = this.generateHtmlTemplate(metadata, qrCodeDataUrl, tokenId);

            // Set content and generate PDF
            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px',
                },
            });

            return Buffer.from(pdfBuffer);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    private generateHtmlTemplate(
        metadata: DigitalPassportMetadata,
        qrCodeDataUrl: string,
        tokenId: string,
    ): string {
        const issueDate = new Date().toLocaleDateString();

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Tourii Digital Passport</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
                
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    font-family: 'Inter', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 20px;
                }
                
                .passport-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    overflow: hidden;
                    position: relative;
                }
                
                .passport-header {
                    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    position: relative;
                }
                
                .passport-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
                
                .passport-subtitle {
                    font-size: 16px;
                    opacity: 0.9;
                    font-weight: 300;
                }
                
                .passport-body {
                    padding: 40px 30px;
                    display: grid;
                    grid-template-columns: 1fr 200px;
                    gap: 30px;
                }
                
                .passport-info h2 {
                    color: #2c3e50;
                    margin-bottom: 20px;
                    font-size: 24px;
                    font-weight: 600;
                }
                
                .attribute-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .attribute {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    border-left: 4px solid #667eea;
                }
                
                .attribute-label {
                    font-size: 12px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 5px;
                    font-weight: 600;
                }
                
                .attribute-value {
                    font-size: 16px;
                    color: #2c3e50;
                    font-weight: 600;
                }
                
                .qr-section {
                    text-align: center;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }
                
                .qr-code {
                    width: 150px;
                    height: 150px;
                    margin: 0 auto 15px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                }
                
                .qr-label {
                    font-size: 12px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 600;
                }
                
                .passport-footer {
                    background: #f8f9fa;
                    padding: 20px 30px;
                    border-top: 1px solid #e9ecef;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                    color: #666;
                }
                
                .security-features {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 100px;
                    height: 100px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 0 15px 0 100px;
                }
                
                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 60px;
                    color: rgba(0,0,0,0.03);
                    font-weight: 700;
                    z-index: 0;
                    pointer-events: none;
                }
                
                .achievements-section {
                    margin-top: 20px;
                    padding: 20px;
                    background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
                    border-radius: 10px;
                    color: #2d3436;
                }
                
                .achievements-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    text-align: center;
                }
                
                .achievement-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    text-align: center;
                }
                
                .stat-item {
                    background: rgba(255,255,255,0.8);
                    padding: 10px;
                    border-radius: 6px;
                }
                
                .stat-number {
                    font-size: 24px;
                    font-weight: 700;
                    color: #2d3436;
                }
                
                .stat-label {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #636e72;
                }
                
                @media print {
                    body { background: white; padding: 0; }
                    .passport-container { box-shadow: none; }
                }
            </style>
        </head>
        <body>
            <div class="watermark">TOURII</div>
            <div class="passport-container">
                <div class="security-features"></div>
                
                <div class="passport-header">
                    <h1 class="passport-title">DIGITAL PASSPORT</h1>
                    <p class="passport-subtitle">Tourii Travel Credentials</p>
                </div>
                
                <div class="passport-body">
                    <div class="passport-info">
                        <h2>${metadata.name}</h2>
                        
                        <div class="attribute-grid">
                            ${metadata.attributes
                                .map(
                                    (attr: PassportAttribute) => `
                                <div class="attribute">
                                    <div class="attribute-label">${attr.trait_type}</div>
                                    <div class="attribute-value">${attr.value}${attr.display_type === 'number' ? '' : ''}</div>
                                </div>
                            `,
                                )
                                .join('')}
                            <div class="attribute">
                                <div class="attribute-label">Issue Date</div>
                                <div class="attribute-value">${issueDate}</div>
                            </div>
                            <div class="attribute">
                                <div class="attribute-label">Token ID</div>
                                <div class="attribute-value">#${tokenId}</div>
                            </div>
                        </div>
                        
                        <div class="achievements-section">
                            <div class="achievements-title">🏆 Travel Achievements</div>
                            <div class="achievement-stats">
                                <div class="stat-item">
                                    <div class="stat-number">${metadata.attributes.find((a: PassportAttribute) => a.trait_type === 'Quests Completed')?.value || 0}</div>
                                    <div class="stat-label">Quests</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-number">${Math.floor((metadata.attributes.find((a: PassportAttribute) => a.trait_type === 'Travel Distance')?.value as number) || 0)}</div>
                                    <div class="stat-label">Kilometers</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-number">${metadata.attributes.find((a: PassportAttribute) => a.trait_type === 'Magatama Points')?.value || 0}</div>
                                    <div class="stat-label">Points</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="qr-section">
                        <img src="${qrCodeDataUrl}" alt="Verification QR Code" class="qr-code">
                        <div class="qr-label">Scan to Verify</div>
                    </div>
                </div>
                
                <div class="passport-footer">
                    <div>© ${new Date().getFullYear()} Tourii - Digital Travel Platform</div>
                    <div>Issued: ${issueDate}</div>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Check if token ID is a mock/test token
     */
    private isMockTokenId(tokenId: string): boolean {
        const mockTokenIds = [
            '123',
            '456',
            '789',
            'test-user-1',
            'test-user-2',
            'test-user-3',
            'alice',
            'bob',
            'charlie',
        ];
        return mockTokenIds.includes(tokenId);
    }

    /**
     * Get mock metadata based on token ID
     */
    private getMockMetadata(tokenId: string): DigitalPassportMetadata {
        const mockProfiles: Record<string, DigitalPassportMetadata> = {
            '123': {
                name: 'デジタルパスポート #123',
                description: 'テスト用デジタルパスポート',
                image: 'https://example.com/passport-image.png',
                attributes: [
                    { trait_type: 'Username', value: 'テストユーザー' },
                    { trait_type: 'Level', value: 'Eクラス 天津神' },
                    { trait_type: 'Passport Type', value: '天津神' },
                    { trait_type: 'Quests Completed', value: 15 },
                    { trait_type: 'Travel Distance', value: 250 },
                    { trait_type: 'Magatama Points', value: 1500 },
                    { trait_type: 'Premium Status', value: 'プレミアム' },
                    { trait_type: 'CardType', value: '妖怪' },
                    { trait_type: 'CardKanji', value: '妖' },
                ],
            },
            '456': {
                name: 'Digital Passport #456',
                description: 'Advanced Traveler Profile',
                image: 'https://example.com/passport-image-456.png',
                attributes: [
                    { trait_type: 'Username', value: 'AdvancedUser' },
                    { trait_type: 'Level', value: 'S級 国津神' },
                    { trait_type: 'Passport Type', value: '国津神' },
                    { trait_type: 'Quests Completed', value: 42 },
                    { trait_type: 'Travel Distance', value: 1250 },
                    { trait_type: 'Magatama Points', value: 8500 },
                    { trait_type: 'Premium Status', value: 'Premium Plus' },
                    { trait_type: 'CardType', value: '神' },
                    { trait_type: 'CardKanji', value: '神' },
                ],
            },
            '789': {
                name: 'パスポート #789',
                description: '初心者向けデジタルパスポート',
                image: 'https://example.com/passport-image-789.png',
                attributes: [
                    { trait_type: 'Username', value: '初心者さん' },
                    { trait_type: 'Level', value: 'F級 地神' },
                    { trait_type: 'Passport Type', value: '地神' },
                    { trait_type: 'Quests Completed', value: 3 },
                    { trait_type: 'Travel Distance', value: 25 },
                    { trait_type: 'Magatama Points', value: 150 },
                    { trait_type: 'Premium Status', value: 'スタンダード' },
                    { trait_type: 'CardType', value: '人' },
                    { trait_type: 'CardKanji', value: '人' },
                ],
            },
            alice: {
                name: "Alice's Travel Pass",
                description: 'Explorer and Adventure Seeker',
                image: 'https://example.com/alice-passport.png',
                attributes: [
                    { trait_type: 'Username', value: 'Alice Explorer' },
                    { trait_type: 'Level', value: 'A級 山神' },
                    { trait_type: 'Passport Type', value: '山神' },
                    { trait_type: 'Quests Completed', value: 28 },
                    { trait_type: 'Travel Distance', value: 875 },
                    { trait_type: 'Magatama Points', value: 4200 },
                    { trait_type: 'Premium Status', value: 'Premium' },
                    { trait_type: 'CardType', value: '精霊' },
                    { trait_type: 'CardKanji', value: '精' },
                ],
            },
            bob: {
                name: "Bob's Digital ID",
                description: 'Tech Enthusiast Traveler',
                image: 'https://example.com/bob-passport.png',
                attributes: [
                    { trait_type: 'Username', value: 'Bob TechGuru' },
                    { trait_type: 'Level', value: 'B級 水神' },
                    { trait_type: 'Passport Type', value: '水神' },
                    { trait_type: 'Quests Completed', value: 19 },
                    { trait_type: 'Travel Distance', value: 640 },
                    { trait_type: 'Magatama Points', value: 2800 },
                    { trait_type: 'Premium Status', value: 'Standard' },
                    { trait_type: 'CardType', value: '龍' },
                    { trait_type: 'CardKanji', value: '龍' },
                ],
            },
            'test-user-1': {
                name: 'Test User Alpha',
                description: 'Development Testing Profile',
                image: 'https://example.com/test-passport-1.png',
                attributes: [
                    { trait_type: 'Username', value: 'TestAlpha' },
                    { trait_type: 'Level', value: 'C級 火神' },
                    { trait_type: 'Passport Type', value: '火神' },
                    { trait_type: 'Quests Completed', value: 12 },
                    { trait_type: 'Travel Distance', value: 380 },
                    { trait_type: 'Magatama Points', value: 1950 },
                    { trait_type: 'Premium Status', value: 'Standard' },
                    { trait_type: 'CardType', value: '鳥' },
                    { trait_type: 'CardKanji', value: '鳥' },
                ],
            },
        };

        return mockProfiles[tokenId] || mockProfiles['123']; // Fallback to default
    }
}
