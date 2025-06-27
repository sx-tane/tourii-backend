import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AiRouteRecommendationService } from '../../service/ai-route-recommendation.service';
import { AiRouteRecommendationController } from '../ai-route-recommendation.controller';
import { AiRouteRecommendationMapper } from '../mapper/ai-route-recommendation.mapper';

describe('AiRouteRecommendationController', () => {
    let controller: AiRouteRecommendationController;
    let service: jest.Mocked<AiRouteRecommendationService>;

    const mockRequest = {
        keywords: ['animation', 'scenery'],
        mode: 'any' as const,
        region: 'Tokyo',
        proximityRadiusKm: 50,
        minSpotsPerCluster: 2,
        maxSpotsPerCluster: 8,
        maxRoutes: 5,
    };

    const mockServiceResult = {
        generatedRoutes: [
            {
                modelRoute: {
                    modelRouteId: 'route-123',
                    routeName: 'Anime Scenery Adventure',
                    regionDesc: 'Discover beautiful anime locations',
                    recommendation: ['animation', 'scenery', 'adventure'],
                    region: 'Tokyo',
                    regionLatitude: 35.6762,
                    regionLongitude: 139.6503,
                },
                aiContent: {
                    estimatedDuration: '2-3 days',
                    confidenceScore: 0.85,
                },
                metadata: {
                    spotCount: 5,
                    sourceKeywords: ['animation', 'scenery'],
                    generatedAt: new Date('2025-01-01T00:00:00Z'),
                    algorithm: 'clustering-v1',
                },
                cluster: {
                    averageDistance: 25.5,
                    spots: [
                        {
                            touristSpotId: 'spot-1',
                            touristSpotName: 'Anime Museum',
                            touristSpotDesc: 'Famous anime museum',
                            latitude: 35.6762,
                            longitude: 139.6503,
                            touristSpotHashtag: ['animation', 'museum'],
                        },
                    ],
                },
            },
        ],
        summary: {
            totalSpotsFound: 10,
            clustersFormed: 2,
            routesGenerated: 1,
            processingTimeMs: 2500,
        },
    };

    const mockMappedResponse = {
        generatedRoutes: [
            {
                modelRouteId: 'route-123',
                routeName: 'Anime Scenery Adventure',
                regionDesc: 'Discover beautiful anime locations',
                recommendations: ['animation', 'scenery', 'adventure'],
                region: 'Tokyo',
                regionLatitude: 35.6762,
                regionLongitude: 139.6503,
                estimatedDuration: '2-3 days',
                confidenceScore: 0.85,
                spotCount: 5,
                averageDistance: 25.5,
                touristSpots: [
                    {
                        touristSpotId: 'spot-1',
                        touristSpotName: 'Anime Museum',
                        touristSpotDesc: 'Famous anime museum',
                        latitude: 35.6762,
                        longitude: 139.6503,
                        touristSpotHashtag: ['animation', 'museum'],
                        matchedKeywords: ['animation'],
                    },
                ],
                metadata: {
                    sourceKeywords: ['animation', 'scenery'],
                    generatedAt: '2025-01-01T00:00:00.000Z',
                    algorithm: 'clustering-v1',
                    aiGenerated: true,
                },
            },
        ],
        summary: {
            totalSpotsFound: 10,
            clustersFormed: 2,
            routesGenerated: 1,
            processingTimeMs: 2500,
            aiAvailable: true,
        },
        message: 'Successfully generated 1 AI route recommendation',
    };

    beforeEach(async () => {
        const mockService = {
            validateRequest: jest.fn(),
            generateRouteRecommendations: jest.fn(),
            getServiceStatus: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AiRouteRecommendationController],
            providers: [
                {
                    provide: AiRouteRecommendationService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<AiRouteRecommendationController>(AiRouteRecommendationController);
        service = module.get<AiRouteRecommendationService>(
            AiRouteRecommendationService,
        ) as jest.Mocked<AiRouteRecommendationService>;
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('generateRouteRecommendations', () => {
        beforeEach(() => {
            service.validateRequest.mockReturnValue(undefined);
            service.generateRouteRecommendations.mockResolvedValue(mockServiceResult);
            service.getServiceStatus.mockReturnValue({ aiAvailable: true });

            // Mock the mapper
            jest.spyOn(AiRouteRecommendationMapper, 'toResponseDto').mockReturnValue(
                mockMappedResponse,
            );
        });

        it('should successfully generate route recommendations', async () => {
            const result = await controller.generateRouteRecommendations(mockRequest);

            expect(service.validateRequest).toHaveBeenCalledWith({
                keywords: mockRequest.keywords,
                mode: mockRequest.mode,
                region: mockRequest.region,
                clusteringOptions: {
                    proximityRadiusKm: mockRequest.proximityRadiusKm,
                    minSpotsPerCluster: mockRequest.minSpotsPerCluster,
                    maxSpotsPerCluster: mockRequest.maxSpotsPerCluster,
                },
                maxRoutes: mockRequest.maxRoutes,
                userId: undefined,
            });

            expect(service.generateRouteRecommendations).toHaveBeenCalledWith({
                keywords: mockRequest.keywords,
                mode: mockRequest.mode,
                region: mockRequest.region,
                clusteringOptions: {
                    proximityRadiusKm: mockRequest.proximityRadiusKm,
                    minSpotsPerCluster: mockRequest.minSpotsPerCluster,
                    maxSpotsPerCluster: mockRequest.maxSpotsPerCluster,
                },
                maxRoutes: mockRequest.maxRoutes,
                userId: undefined,
            });

            expect(AiRouteRecommendationMapper.toResponseDto).toHaveBeenCalledWith(
                mockServiceResult,
                mockRequest.keywords,
                true,
            );

            expect(result).toEqual(mockMappedResponse);
        });

        it('should handle user context when provided', async () => {
            const userId = 'test-user-123';

            await controller.generateRouteRecommendations(mockRequest, userId);

            expect(service.validateRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId,
                }),
            );

            expect(service.generateRouteRecommendations).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId,
                }),
            );
        });

        it('should handle validation errors from service', async () => {
            const validationError = new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_050,
                'Keywords are required',
                HttpStatus.BAD_REQUEST,
            );

            service.validateRequest.mockImplementation(() => {
                throw validationError;
            });

            await expect(controller.generateRouteRecommendations(mockRequest)).rejects.toThrow(
                validationError,
            );
        });

        it('should handle service errors and wrap them properly', async () => {
            const serviceError = new Error('Database connection failed');
            service.generateRouteRecommendations.mockRejectedValue(serviceError);

            await expect(controller.generateRouteRecommendations(mockRequest)).rejects.toThrow(
                TouriiBackendAppException,
            );

            try {
                await controller.generateRouteRecommendations(mockRequest);
            } catch (error) {
                expect(error).toBeInstanceOf(TouriiBackendAppException);
                expect(error.errorType).toBe(TouriiBackendAppErrorType.E_TB_049);
                expect(error.httpStatus).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(error.details?.originalError).toBe('Database connection failed');
            }
        });

        it('should preserve TouriiBackendAppException from service', async () => {
            const appException = new TouriiBackendAppException(
                TouriiBackendAppErrorType.E_TB_051,
                'No tourist spots found',
                HttpStatus.NOT_FOUND,
            );

            service.generateRouteRecommendations.mockRejectedValue(appException);

            await expect(controller.generateRouteRecommendations(mockRequest)).rejects.toThrow(
                appException,
            );
        });

        it('should handle empty keywords array', async () => {
            const emptyRequest = { ...mockRequest, keywords: [] };

            await controller.generateRouteRecommendations(emptyRequest);

            expect(service.validateRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    keywords: [],
                }),
            );
        });

        it('should handle minimal request with defaults', async () => {
            const minimalRequest = {
                keywords: ['nature'],
                mode: 'any' as const,
            };

            await controller.generateRouteRecommendations(minimalRequest);

            expect(service.validateRequest).toHaveBeenCalledWith({
                keywords: ['nature'],
                mode: 'any',
                region: undefined,
                clusteringOptions: {
                    proximityRadiusKm: undefined,
                    minSpotsPerCluster: undefined,
                    maxSpotsPerCluster: undefined,
                },
                maxRoutes: undefined,
                userId: undefined,
            });
        });

        it('should call checkRateLimit when userId is provided', async () => {
            const userId = 'rate-limited-user';
            const checkRateLimitSpy = jest.spyOn(controller as any, 'checkRateLimit');
            checkRateLimitSpy.mockResolvedValue(undefined);

            await controller.generateRouteRecommendations(mockRequest, userId);

            expect(checkRateLimitSpy).toHaveBeenCalledWith(userId);
        });

        it('should not call checkRateLimit for anonymous users', async () => {
            const checkRateLimitSpy = jest.spyOn(controller as any, 'checkRateLimit');
            checkRateLimitSpy.mockResolvedValue(undefined);

            await controller.generateRouteRecommendations(mockRequest);

            expect(checkRateLimitSpy).not.toHaveBeenCalled();
        });

        it('should handle mapper errors', async () => {
            jest.spyOn(AiRouteRecommendationMapper, 'toResponseDto').mockImplementation(() => {
                throw new Error('Mapping failed');
            });

            await expect(controller.generateRouteRecommendations(mockRequest)).rejects.toThrow(
                TouriiBackendAppException,
            );
        });

        it('should log request and completion information', async () => {
            const logSpy = jest.spyOn(controller['logger'], 'log');

            await controller.generateRouteRecommendations(mockRequest, 'test-user');

            expect(logSpy).toHaveBeenCalledWith('AI route recommendation request received', {
                keywords: mockRequest.keywords,
                mode: mockRequest.mode,
                region: mockRequest.region,
                userId: 'test-user',
            });

            expect(logSpy).toHaveBeenCalledWith('AI route recommendation completed', {
                routesGenerated: 1,
                processingTime: 2500,
                userId: 'test-user',
            });
        });

        it('should log errors with context', async () => {
            const error = new Error('Test error');
            const errorSpy = jest.spyOn(controller['logger'], 'error');
            service.generateRouteRecommendations.mockRejectedValue(error);

            try {
                await controller.generateRouteRecommendations(mockRequest, 'test-user');
            } catch {
                // Expected to throw
            }

            expect(errorSpy).toHaveBeenCalledWith('AI route recommendation failed', {
                error: 'Test error',
                keywords: mockRequest.keywords,
                userId: 'test-user',
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle extremely large proximity radius', async () => {
            const largeRadiusRequest = { ...mockRequest, proximityRadiusKm: 200 };

            service.validateRequest.mockReturnValue(undefined);
            service.generateRouteRecommendations.mockResolvedValue(mockServiceResult);
            service.getServiceStatus.mockReturnValue({ aiAvailable: true });

            await controller.generateRouteRecommendations(largeRadiusRequest);

            expect(service.validateRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    clusteringOptions: expect.objectContaining({
                        proximityRadiusKm: 200,
                    }),
                }),
            );
        });

        it('should handle maximum number of routes request', async () => {
            const maxRoutesRequest = { ...mockRequest, maxRoutes: 20 };

            service.validateRequest.mockReturnValue(undefined);
            service.generateRouteRecommendations.mockResolvedValue(mockServiceResult);
            service.getServiceStatus.mockReturnValue({ aiAvailable: true });

            await controller.generateRouteRecommendations(maxRoutesRequest);

            expect(service.validateRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    maxRoutes: 20,
                }),
            );
        });

        it('should handle all keyword matching mode', async () => {
            const allModeRequest = { ...mockRequest, mode: 'all' as const };

            service.validateRequest.mockReturnValue(undefined);
            service.generateRouteRecommendations.mockResolvedValue(mockServiceResult);
            service.getServiceStatus.mockReturnValue({ aiAvailable: true });

            await controller.generateRouteRecommendations(allModeRequest);

            expect(service.validateRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    mode: 'all',
                }),
            );
        });
    });

    describe('Performance Tests', () => {
        it('should complete within reasonable time for normal requests', async () => {
            service.validateRequest.mockReturnValue(undefined);
            service.generateRouteRecommendations.mockResolvedValue(mockServiceResult);
            service.getServiceStatus.mockReturnValue({ aiAvailable: true });

            const startTime = Date.now();
            await controller.generateRouteRecommendations(mockRequest);
            const endTime = Date.now();

            // Should complete within 100ms (excluding actual service time)
            expect(endTime - startTime).toBeLessThan(100);
        });

        it('should handle concurrent requests', async () => {
            service.validateRequest.mockReturnValue(undefined);
            service.generateRouteRecommendations.mockResolvedValue(mockServiceResult);
            service.getServiceStatus.mockReturnValue({ aiAvailable: true });

            const requests = Array.from({ length: 5 }, (_, i) =>
                controller.generateRouteRecommendations({
                    ...mockRequest,
                    keywords: [`keyword-${i}`],
                }),
            );

            const results = await Promise.all(requests);
            expect(results).toHaveLength(5);
            expect(service.generateRouteRecommendations).toHaveBeenCalledTimes(5);
        });
    });
});
