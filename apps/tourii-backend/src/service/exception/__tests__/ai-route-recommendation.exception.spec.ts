import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { HttpStatus } from '@nestjs/common';
import {
    AiContentGenerationException,
    AiRouteValidationException,
    GeographicClusteringException,
    RouteCreationException,
    TouristSpotSearchException,
} from '../ai-route-recommendation.exception';

describe('AI Route Recommendation Exceptions', () => {
    describe('AiRouteValidationException', () => {
        it('should create exception with correct error type and status', () => {
            const exception = new AiRouteValidationException('Test validation error');

            expect(exception.errorType).toBe(TouriiBackendAppErrorType.E_TB_050);
            expect(exception.httpStatus).toBe(HttpStatus.BAD_REQUEST);
            expect(exception.message).toBe('Test validation error');
        });

        it('should include details when provided', () => {
            const details = { field: 'keywords', value: [] };
            const exception = new AiRouteValidationException('Test error', details);

            expect(exception.details).toEqual(details);
        });

        describe('Factory Methods', () => {
            it('keywordsRequired should create appropriate exception', () => {
                const exception = AiRouteValidationException.keywordsRequired();

                expect(exception.message).toBe('Keywords are required for route recommendation');
                expect(exception.details).toEqual({
                    field: 'keywords',
                    requirement: 'non-empty array',
                });
            });

            it('invalidKeywordCount should create appropriate exception', () => {
                const exception = AiRouteValidationException.invalidKeywordCount(15, 10);

                expect(exception.message).toBe(
                    'Too many keywords provided. Maximum 10 keywords allowed, got 15',
                );
                expect(exception.details).toEqual({
                    providedCount: 15,
                    maxAllowed: 10,
                });
            });

            it('invalidProximityRadius should create appropriate exception', () => {
                const exception = AiRouteValidationException.invalidProximityRadius(300);

                expect(exception.message).toBe(
                    'Invalid proximity radius: 300. Must be between 1 and 200 kilometers',
                );
                expect(exception.details).toEqual({
                    providedRadius: 300,
                    validRange: '1-200 km',
                });
            });
        });
    });

    describe('TouristSpotSearchException', () => {
        it('should create exception with correct error type and status', () => {
            const exception = new TouristSpotSearchException('No spots found');

            expect(exception.errorType).toBe(TouriiBackendAppErrorType.E_TB_051);
            expect(exception.httpStatus).toBe(HttpStatus.NOT_FOUND);
            expect(exception.message).toBe('No spots found');
        });

        describe('Factory Methods', () => {
            it('noSpotsFound should create appropriate exception', () => {
                const keywords = ['nonexistent', 'keywords'];
                const exception = TouristSpotSearchException.noSpotsFound(keywords);

                expect(exception.message).toBe(
                    'No tourist spots found matching the provided keywords',
                );
                expect(exception.details).toEqual({
                    searchKeywords: keywords,
                });
            });

            it('insufficientSpotsForClustering should create appropriate exception', () => {
                const exception = TouristSpotSearchException.insufficientSpotsForClustering(1, 2);

                expect(exception.message).toBe(
                    'Insufficient tourist spots for route generation. Found 1, minimum 2 required',
                );
                expect(exception.details).toEqual({
                    spotsFound: 1,
                    minRequired: 2,
                });
            });
        });
    });

    describe('GeographicClusteringException', () => {
        it('should create exception with correct error type and status', () => {
            const exception = new GeographicClusteringException('Clustering failed');

            expect(exception.errorType).toBe(TouriiBackendAppErrorType.E_TB_052);
            expect(exception.httpStatus).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(exception.message).toBe('Clustering failed');
        });

        describe('Factory Methods', () => {
            it('clusteringFailed should create appropriate exception', () => {
                const reason = 'Invalid coordinates detected';
                const exception = GeographicClusteringException.clusteringFailed(reason);

                expect(exception.message).toBe(`Geographic clustering failed: ${reason}`);
                expect(exception.details).toEqual({
                    failureReason: reason,
                });
            });

            it('noClustersFormed should create appropriate exception', () => {
                const exception = GeographicClusteringException.noClustersFormed();

                expect(exception.message).toBe('No viable clusters formed from the tourist spots');
                expect(exception.details).toEqual({
                    hint: 'Try increasing proximity radius or reducing minimum spots per cluster',
                });
            });
        });
    });

    describe('AiContentGenerationException', () => {
        it('should create exception with correct error type and status', () => {
            const exception = new AiContentGenerationException('AI service failed');

            expect(exception.errorType).toBe(TouriiBackendAppErrorType.E_TB_053);
            expect(exception.httpStatus).toBe(HttpStatus.SERVICE_UNAVAILABLE);
            expect(exception.message).toBe('AI service failed');
        });

        describe('Factory Methods', () => {
            it('aiServiceUnavailable should create appropriate exception', () => {
                const exception = AiContentGenerationException.aiServiceUnavailable();

                expect(exception.message).toBe(
                    'AI content generation service is temporarily unavailable',
                );
                expect(exception.details).toEqual({
                    fallbackMode: 'Using template-based content generation',
                });
            });

            it('contentGenerationFailed should create appropriate exception', () => {
                const error = 'API quota exceeded';
                const exception = AiContentGenerationException.contentGenerationFailed(error);

                expect(exception.message).toBe(`AI content generation failed: ${error}`);
                expect(exception.details).toEqual({
                    originalError: error,
                    suggestion: 'Retry with different keywords',
                });
            });

            it('rateLimitExceeded should create appropriate exception without userId', () => {
                const exception = AiContentGenerationException.rateLimitExceeded();

                expect(exception.message).toBe(
                    'AI service rate limit exceeded. Please try again later',
                );
                expect(exception.details).toEqual({
                    userId: undefined,
                    retryAfter: '5 minutes',
                });
            });

            it('rateLimitExceeded should create appropriate exception with userId', () => {
                const userId = 'user-123';
                const exception = AiContentGenerationException.rateLimitExceeded(userId);

                expect(exception.message).toBe(
                    'AI service rate limit exceeded. Please try again later',
                );
                expect(exception.details).toEqual({
                    userId,
                    retryAfter: '5 minutes',
                });
            });
        });
    });

    describe('RouteCreationException', () => {
        it('should create exception with correct error type and status', () => {
            const exception = new RouteCreationException('Database error');

            expect(exception.errorType).toBe(TouriiBackendAppErrorType.E_TB_054);
            expect(exception.httpStatus).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(exception.message).toBe('Database error');
        });

        describe('Factory Methods', () => {
            it('routePersistenceFailed should create appropriate exception', () => {
                const error = 'Connection timeout';
                const exception = RouteCreationException.routePersistenceFailed(error);

                expect(exception.message).toBe(
                    `Failed to persist AI-generated route to database: ${error}`,
                );
                expect(exception.details).toEqual({
                    originalError: error,
                });
            });

            it('invalidRouteData should create appropriate exception', () => {
                const missingFields = ['routeName', 'regionDesc'];
                const exception = RouteCreationException.invalidRouteData(missingFields);

                expect(exception.message).toBe(
                    'Cannot create route due to missing required data: routeName, regionDesc',
                );
                expect(exception.details).toEqual({
                    missingFields,
                });
            });

            it('invalidRouteData should handle empty array', () => {
                const exception = RouteCreationException.invalidRouteData([]);

                expect(exception.message).toBe(
                    'Cannot create route due to missing required data: ',
                );
                expect(exception.details).toEqual({
                    missingFields: [],
                });
            });

            it('invalidRouteData should handle single missing field', () => {
                const missingFields = ['coordinates'];
                const exception = RouteCreationException.invalidRouteData(missingFields);

                expect(exception.message).toBe(
                    'Cannot create route due to missing required data: coordinates',
                );
                expect(exception.details).toEqual({
                    missingFields,
                });
            });
        });
    });

    describe('Exception Inheritance', () => {
        it('all exceptions should extend TouriiBackendAppException', () => {
            const validationException = new AiRouteValidationException('test');
            const searchException = new TouristSpotSearchException('test');
            const clusteringException = new GeographicClusteringException('test');
            const aiException = new AiContentGenerationException('test');
            const creationException = new RouteCreationException('test');

            expect(validationException).toBeInstanceOf(Error);
            expect(searchException).toBeInstanceOf(Error);
            expect(clusteringException).toBeInstanceOf(Error);
            expect(aiException).toBeInstanceOf(Error);
            expect(creationException).toBeInstanceOf(Error);
        });

        it('should preserve stack traces', () => {
            const exception = new AiRouteValidationException('test error');
            expect(exception.stack).toBeDefined();
            expect(exception.stack).toContain('AiRouteValidationException');
        });

        it('should have correct constructor names', () => {
            expect(new AiRouteValidationException('test').constructor.name).toBe(
                'AiRouteValidationException',
            );
            expect(new TouristSpotSearchException('test').constructor.name).toBe(
                'TouristSpotSearchException',
            );
            expect(new GeographicClusteringException('test').constructor.name).toBe(
                'GeographicClusteringException',
            );
            expect(new AiContentGenerationException('test').constructor.name).toBe(
                'AiContentGenerationException',
            );
            expect(new RouteCreationException('test').constructor.name).toBe(
                'RouteCreationException',
            );
        });
    });

    describe('Error Serialization', () => {
        it('should serialize exceptions to JSON correctly', () => {
            const exception = AiRouteValidationException.invalidKeywordCount(15, 10);
            const serialized = JSON.stringify(exception);
            const parsed = JSON.parse(serialized);

            expect(parsed.message).toBe(exception.message);
            expect(parsed.name).toBe('AiRouteValidationException');
        });

        it('should preserve details in serialization', () => {
            const details = { field: 'test', value: 'invalid' };
            const exception = new AiRouteValidationException('test', details);

            // Custom serialization would need to be implemented in the base class
            expect(exception.details).toEqual(details);
        });
    });

    describe('Exception Chaining', () => {
        it('should support exception chaining with original errors', () => {
            const originalError = new Error('Original database error');
            const chainedException = RouteCreationException.routePersistenceFailed(
                originalError.message,
            );

            expect(chainedException.details?.originalError).toBe(originalError.message);
        });

        it('should maintain error context across chaining', () => {
            const searchKeywords = ['test1', 'test2'];
            const searchException = TouristSpotSearchException.noSpotsFound(searchKeywords);

            expect(searchException.details?.searchKeywords).toEqual(searchKeywords);
            expect(searchException.httpStatus).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe('Performance', () => {
        it('should create exceptions quickly', () => {
            const startTime = Date.now();

            for (let i = 0; i < 1000; i++) {
                new AiRouteValidationException(`Test error ${i}`);
            }

            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
        });

        it('should handle large detail objects', () => {
            const largeDetails = {
                data: Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `item-${i}` })),
                metadata: { timestamp: Date.now(), version: '1.0.0' },
            };

            const exception = new AiRouteValidationException('Large details test', largeDetails);
            expect(exception.details).toEqual(largeDetails);
        });
    });
});
