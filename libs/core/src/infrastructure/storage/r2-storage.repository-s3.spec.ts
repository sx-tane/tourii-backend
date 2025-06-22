import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { R2StorageRepositoryS3 } from './r2-storage.repository-s3';

// Mock the AWS SDK
const mockSend = jest.fn();
const mockS3Client = {
    send: mockSend,
};

jest.mock('@aws-sdk/client-s3', () => ({
    S3Client: jest.fn(() => mockS3Client),
    PutObjectCommand: jest.fn((params) => params),
}));

describe('R2StorageRepositoryS3', () => {
    let repository: R2StorageRepositoryS3;
    let configService: ConfigService;

    const mockConfigGet = jest.fn();

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: {
                        get: mockConfigGet,
                    },
                },
            ],
        }).compile();

        configService = module.get(ConfigService);
    });

    describe('Constructor/Initialization', () => {
        it('should throw TouriiBackendAppException E_TB_035 when R2_ACCOUNT_ID is not configured', () => {
            mockConfigGet.mockImplementation((key: string) => {
                if (key === 'R2_ACCOUNT_ID') return undefined;
                return 'default-value';
            });

            expect(() => {
                new R2StorageRepositoryS3(configService);
            }).toThrow(TouriiBackendAppException);

            try {
                new R2StorageRepositoryS3(configService);
            } catch (error) {
                expect(error).toBeInstanceOf(TouriiBackendAppException);
                if (error instanceof TouriiBackendAppException) {
                    const response = error.getResponse() as { code: string; message: string };
                    expect(response.code).toBe(TouriiBackendAppErrorType.E_TB_035.code);
                    expect(response.message).toBe(TouriiBackendAppErrorType.E_TB_035.message);
                }
            }
        });

        it('should initialize successfully when R2_ACCOUNT_ID is configured', () => {
            mockConfigGet.mockImplementation((key: string) => {
                switch (key) {
                    case 'R2_ACCOUNT_ID':
                        return 'test-account-id';
                    case 'AWS_REGION':
                        return 'auto';
                    case 'AWS_ACCESS_KEY_ID':
                        return 'test-access-key';
                    case 'AWS_SECRET_ACCESS_KEY':
                        return 'test-secret-key';
                    default:
                        return undefined;
                }
            });

            expect(() => {
                repository = new R2StorageRepositoryS3(configService);
            }).not.toThrow();
        });
    });

    describe('uploadProof', () => {
        beforeEach(() => {
            mockConfigGet.mockImplementation((key: string) => {
                switch (key) {
                    case 'R2_ACCOUNT_ID':
                        return 'test-account-id';
                    case 'AWS_REGION':
                        return 'auto';
                    case 'AWS_ACCESS_KEY_ID':
                        return 'test-access-key';
                    case 'AWS_SECRET_ACCESS_KEY':
                        return 'test-secret-key';
                    case 'R2_BUCKET':
                        return 'test-bucket';
                    case 'R2_PUBLIC_DOMAIN':
                        return 'https://cdn.example.com';
                    default:
                        return undefined;
                }
            });
            repository = new R2StorageRepositoryS3(configService);
        });

        it('should throw TouriiBackendAppException E_TB_036 when R2_BUCKET is not configured', async () => {
            mockConfigGet.mockImplementation((key: string) => {
                if (key === 'R2_BUCKET') return undefined;
                switch (key) {
                    case 'R2_ACCOUNT_ID':
                        return 'test-account-id';
                    case 'AWS_REGION':
                        return 'auto';
                    case 'AWS_ACCESS_KEY_ID':
                        return 'test-access-key';
                    case 'AWS_SECRET_ACCESS_KEY':
                        return 'test-secret-key';
                    default:
                        return undefined;
                }
            });

            const testFile = Buffer.from('test file content');
            const testKey = 'test-key.jpg';
            const testContentType = 'image/jpeg';

            await expect(
                repository.uploadProof(testFile, testKey, testContentType),
            ).rejects.toThrow(TouriiBackendAppException);

            try {
                await repository.uploadProof(testFile, testKey, testContentType);
            } catch (error) {
                expect(error).toBeInstanceOf(TouriiBackendAppException);
                if (error instanceof TouriiBackendAppException) {
                    const response = error.getResponse() as { code: string; message: string };
                    expect(response.code).toBe(TouriiBackendAppErrorType.E_TB_036.code);
                    expect(response.message).toBe(TouriiBackendAppErrorType.E_TB_036.message);
                }
            }
        });

        it('should throw TouriiBackendAppException E_TB_037 when S3 upload fails', async () => {
            mockSend.mockRejectedValueOnce(new Error('S3 upload failed'));

            const testFile = Buffer.from('test file content');
            const testKey = 'test-key.jpg';
            const testContentType = 'image/jpeg';

            await expect(
                repository.uploadProof(testFile, testKey, testContentType),
            ).rejects.toThrow(TouriiBackendAppException);

            try {
                await repository.uploadProof(testFile, testKey, testContentType);
            } catch (error) {
                expect(error).toBeInstanceOf(TouriiBackendAppException);
                if (error instanceof TouriiBackendAppException) {
                    const response = error.getResponse() as { code: string; message: string };
                    expect(response.code).toBe(TouriiBackendAppErrorType.E_TB_037.code);
                    expect(response.message).toBe(TouriiBackendAppErrorType.E_TB_037.message);
                }
            }
        });

        it('should return public URL when upload succeeds', async () => {
            mockSend.mockResolvedValueOnce({ success: true });

            const testFile = Buffer.from('test file content');
            const testKey = 'test-key.jpg';
            const testContentType = 'image/jpeg';

            const result = await repository.uploadProof(testFile, testKey, testContentType);

            expect(result).toBe('https://cdn.example.com/test-key.jpg');
            expect(mockSend).toHaveBeenCalledTimes(1);
        });
    });

    describe('uploadMetadata', () => {
        beforeEach(() => {
            mockConfigGet.mockImplementation((key: string) => {
                switch (key) {
                    case 'R2_ACCOUNT_ID':
                        return 'test-account-id';
                    case 'AWS_REGION':
                        return 'auto';
                    case 'AWS_ACCESS_KEY_ID':
                        return 'test-access-key';
                    case 'AWS_SECRET_ACCESS_KEY':
                        return 'test-secret-key';
                    case 'R2_BUCKET':
                        return 'test-bucket';
                    case 'R2_PUBLIC_DOMAIN':
                        return 'https://cdn.example.com';
                    default:
                        return undefined;
                }
            });
            repository = new R2StorageRepositoryS3(configService);
        });

        it('should throw TouriiBackendAppException E_TB_036 when R2_BUCKET is not configured', async () => {
            mockConfigGet.mockImplementation((key: string) => {
                if (key === 'R2_BUCKET') return undefined;
                switch (key) {
                    case 'R2_ACCOUNT_ID':
                        return 'test-account-id';
                    case 'AWS_REGION':
                        return 'auto';
                    case 'AWS_ACCESS_KEY_ID':
                        return 'test-access-key';
                    case 'AWS_SECRET_ACCESS_KEY':
                        return 'test-secret-key';
                    default:
                        return undefined;
                }
            });

            const testMetadata = { title: 'Test NFT', description: 'Test description' };
            const testKey = 'metadata.json';

            await expect(repository.uploadMetadata(testMetadata, testKey)).rejects.toThrow(
                TouriiBackendAppException,
            );

            try {
                await repository.uploadMetadata(testMetadata, testKey);
            } catch (error) {
                expect(error).toBeInstanceOf(TouriiBackendAppException);
                if (error instanceof TouriiBackendAppException) {
                    const response = error.getResponse() as { code: string; message: string };
                    expect(response.code).toBe(TouriiBackendAppErrorType.E_TB_036.code);
                }
            }
        });

        it('should throw TouriiBackendAppException E_TB_038 when S3 metadata upload fails', async () => {
            mockSend.mockRejectedValueOnce(new Error('S3 metadata upload failed'));

            const testMetadata = { title: 'Test NFT', description: 'Test description' };
            const testKey = 'metadata.json';

            await expect(repository.uploadMetadata(testMetadata, testKey)).rejects.toThrow(
                TouriiBackendAppException,
            );

            try {
                await repository.uploadMetadata(testMetadata, testKey);
            } catch (error) {
                expect(error).toBeInstanceOf(TouriiBackendAppException);
                if (error instanceof TouriiBackendAppException) {
                    const response = error.getResponse() as { code: string; message: string };
                    expect(response.code).toBe(TouriiBackendAppErrorType.E_TB_038.code);
                    expect(response.message).toBe(TouriiBackendAppErrorType.E_TB_038.message);
                }
            }
        });

        it('should return public URL when metadata upload succeeds', async () => {
            mockSend.mockResolvedValueOnce({ success: true });

            const testMetadata = { title: 'Test NFT', description: 'Test description' };
            const testKey = 'metadata.json';

            const result = await repository.uploadMetadata(testMetadata, testKey);

            expect(result).toBe('https://cdn.example.com/metadata.json');
            expect(mockSend).toHaveBeenCalledTimes(1);
        });

        it('should properly format metadata as JSON buffer', async () => {
            mockSend.mockResolvedValueOnce({ success: true });

            const testMetadata = { title: 'Test NFT', description: 'Test description' };
            const testKey = 'metadata.json';

            await repository.uploadMetadata(testMetadata, testKey);

            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    Bucket: 'test-bucket',
                    Key: testKey,
                    Body: Buffer.from(JSON.stringify(testMetadata, null, 2), 'utf-8'),
                    ContentType: 'application/json',
                    ACL: 'public-read',
                    CacheControl: 'max-age=3600',
                }),
            );
        });
    });

    describe('generatePublicUrl', () => {
        beforeEach(() => {
            mockConfigGet.mockImplementation((key: string) => {
                switch (key) {
                    case 'R2_ACCOUNT_ID':
                        return 'test-account-id';
                    case 'AWS_REGION':
                        return 'auto';
                    case 'AWS_ACCESS_KEY_ID':
                        return 'test-access-key';
                    case 'AWS_SECRET_ACCESS_KEY':
                        return 'test-secret-key';
                    case 'R2_PUBLIC_DOMAIN':
                        return 'https://cdn.example.com/';
                    default:
                        return undefined;
                }
            });
            repository = new R2StorageRepositoryS3(configService);
        });

        it('should throw TouriiBackendAppException E_TB_039 when R2_PUBLIC_DOMAIN is not configured', () => {
            mockConfigGet.mockImplementation((key: string) => {
                if (key === 'R2_PUBLIC_DOMAIN') return undefined;
                switch (key) {
                    case 'R2_ACCOUNT_ID':
                        return 'test-account-id';
                    case 'AWS_REGION':
                        return 'auto';
                    case 'AWS_ACCESS_KEY_ID':
                        return 'test-access-key';
                    case 'AWS_SECRET_ACCESS_KEY':
                        return 'test-secret-key';
                    default:
                        return undefined;
                }
            });

            // Recreate repository with new config
            const newRepository = new R2StorageRepositoryS3(configService);

            expect(() => {
                newRepository.generatePublicUrl('test-key.jpg');
            }).toThrow(TouriiBackendAppException);

            try {
                newRepository.generatePublicUrl('test-key.jpg');
            } catch (error) {
                expect(error).toBeInstanceOf(TouriiBackendAppException);
                if (error instanceof TouriiBackendAppException) {
                    const response = error.getResponse() as { code: string; message: string };
                    expect(response.code).toBe(TouriiBackendAppErrorType.E_TB_039.code);
                    expect(response.message).toBe(TouriiBackendAppErrorType.E_TB_039.message);
                }
            }
        });

        it('should generate correct public URL when R2_PUBLIC_DOMAIN is configured', () => {
            const testKey = 'test-key.jpg';
            const result = repository.generatePublicUrl(testKey);

            expect(result).toBe('https://cdn.example.com/test-key.jpg');
        });

        it('should handle R2_PUBLIC_DOMAIN with trailing slash correctly', () => {
            mockConfigGet.mockImplementation((key: string) => {
                switch (key) {
                    case 'R2_ACCOUNT_ID':
                        return 'test-account-id';
                    case 'AWS_REGION':
                        return 'auto';
                    case 'AWS_ACCESS_KEY_ID':
                        return 'test-access-key';
                    case 'AWS_SECRET_ACCESS_KEY':
                        return 'test-secret-key';
                    case 'R2_PUBLIC_DOMAIN':
                        return 'https://cdn.example.com/'; // With trailing slash
                    default:
                        return undefined;
                }
            });

            const newRepository = new R2StorageRepositoryS3(configService);
            const testKey = 'test-key.jpg';
            const result = newRepository.generatePublicUrl(testKey);

            expect(result).toBe('https://cdn.example.com/test-key.jpg');
        });

        it('should handle R2_PUBLIC_DOMAIN without trailing slash correctly', () => {
            mockConfigGet.mockImplementation((key: string) => {
                switch (key) {
                    case 'R2_ACCOUNT_ID':
                        return 'test-account-id';
                    case 'AWS_REGION':
                        return 'auto';
                    case 'AWS_ACCESS_KEY_ID':
                        return 'test-access-key';
                    case 'AWS_SECRET_ACCESS_KEY':
                        return 'test-secret-key';
                    case 'R2_PUBLIC_DOMAIN':
                        return 'https://cdn.example.com'; // Without trailing slash
                    default:
                        return undefined;
                }
            });

            const newRepository = new R2StorageRepositoryS3(configService);
            const testKey = 'test-key.jpg';
            const result = newRepository.generatePublicUrl(testKey);

            expect(result).toBe('https://cdn.example.com/test-key.jpg');
        });
    });

    describe('Error Message Validation', () => {
        it('should use proper error types for all TouriiBackendAppException instances', () => {
            // Test that all our error types are properly defined
            expect(TouriiBackendAppErrorType.E_TB_035.type).toBeDefined();
            expect(TouriiBackendAppErrorType.E_TB_036.type).toBeDefined();
            expect(TouriiBackendAppErrorType.E_TB_037.type).toBeDefined();
            expect(TouriiBackendAppErrorType.E_TB_038.type).toBeDefined();
            expect(TouriiBackendAppErrorType.E_TB_039.type).toBeDefined();

            // Test error codes
            expect(TouriiBackendAppErrorType.E_TB_035.code).toBe('E_TB_035');
            expect(TouriiBackendAppErrorType.E_TB_036.code).toBe('E_TB_036');
            expect(TouriiBackendAppErrorType.E_TB_037.code).toBe('E_TB_037');
            expect(TouriiBackendAppErrorType.E_TB_038.code).toBe('E_TB_038');
            expect(TouriiBackendAppErrorType.E_TB_039.code).toBe('E_TB_039');

            // Test error messages are meaningful
            expect(TouriiBackendAppErrorType.E_TB_035.message).toContain('endpoint');
            expect(TouriiBackendAppErrorType.E_TB_036.message).toContain('bucket');
            expect(TouriiBackendAppErrorType.E_TB_037.message).toContain('upload');
            expect(TouriiBackendAppErrorType.E_TB_038.message).toContain('Metadata');
            expect(TouriiBackendAppErrorType.E_TB_039.message).toContain('domain');
        });
    });
});
