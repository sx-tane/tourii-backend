import { AiRouteRecommendationMapper } from '../ai-route-recommendation.mapper';

describe('AiRouteRecommendationMapper', () => {
    const mockGeneratedRoute = {
        modelRoute: {
            modelRouteId: 'route-123',
            routeName: 'Anime Adventure Route',
            regionDesc: 'Explore iconic anime locations in Tokyo',
            recommendation: ['animation', 'adventure', 'otaku'],
            region: 'Tokyo',
            regionLatitude: 35.6762,
            regionLongitude: 139.6503,
        },
        aiContent: {
            estimatedDuration: '2-3 days',
            confidenceScore: 0.85,
        },
        metadata: {
            spotCount: 4,
            sourceKeywords: ['anime', 'animation'],
            generatedAt: new Date('2025-01-01T10:30:00Z'),
            algorithm: 'clustering-v2',
        },
        cluster: {
            averageDistance: 15.7,
            spots: [
                {
                    touristSpotId: 'spot-1',
                    touristSpotName: 'Akihabara Electronics District',
                    touristSpotDesc: 'Famous electronics and anime district',
                    latitude: 35.7022,
                    longitude: 139.7731,
                    touristSpotHashtag: ['electronics', 'anime', 'otaku'],
                },
                {
                    touristSpotId: 'spot-2',
                    touristSpotName: 'Tokyo Anime Center',
                    touristSpotDesc: undefined,
                    latitude: 35.7019,
                    longitude: 139.7736,
                    touristSpotHashtag: ['animation', 'museum'],
                },
            ],
        },
    };

    const mockResult = {
        generatedRoutes: [mockGeneratedRoute],
        summary: {
            totalSpotsFound: 15,
            clustersFormed: 3,
            routesGenerated: 1,
            processingTimeMs: 2800,
        },
    };

    describe('toResponseDto', () => {
        it('should successfully map a complete result to response DTO', () => {
            const searchKeywords = ['anime', 'animation'];
            const aiAvailable = true;

            const result = AiRouteRecommendationMapper.toResponseDto(
                mockResult,
                searchKeywords,
                aiAvailable,
            );

            expect(result).toEqual({
                generatedRoutes: [
                    {
                        modelRouteId: 'route-123',
                        routeName: 'Anime Adventure Route',
                        regionDesc: 'Explore iconic anime locations in Tokyo',
                        recommendations: ['animation', 'adventure', 'otaku'],
                        region: 'Tokyo',
                        regionLatitude: 35.6762,
                        regionLongitude: 139.6503,
                        estimatedDuration: '2-3 days',
                        confidenceScore: 0.85,
                        spotCount: 4,
                        averageDistance: 15.7,
                        touristSpots: [
                            {
                                touristSpotId: 'spot-1',
                                touristSpotName: 'Akihabara Electronics District',
                                touristSpotDesc: 'Famous electronics and anime district',
                                latitude: 35.7022,
                                longitude: 139.7731,
                                touristSpotHashtag: ['electronics', 'anime', 'otaku'],
                                matchedKeywords: ['anime'],
                            },
                            {
                                touristSpotId: 'spot-2',
                                touristSpotName: 'Tokyo Anime Center',
                                touristSpotDesc: undefined,
                                latitude: 35.7019,
                                longitude: 139.7736,
                                touristSpotHashtag: ['animation', 'museum'],
                                matchedKeywords: ['animation'],
                            },
                        ],
                        metadata: {
                            sourceKeywords: ['anime', 'animation'],
                            generatedAt: '2025-01-01T10:30:00.000Z',
                            algorithm: 'clustering-v2',
                            aiGenerated: true,
                        },
                    },
                ],
                summary: {
                    totalSpotsFound: 15,
                    clustersFormed: 3,
                    routesGenerated: 1,
                    processingTimeMs: 2800,
                    aiAvailable: true,
                },
                message: 'Successfully generated 1 AI route recommendation',
            });
        });

        it('should handle null/undefined values gracefully', () => {
            const incompleteRoute = {
                modelRoute: {
                    modelRouteId: undefined,
                    routeName: null,
                    regionDesc: '',
                    recommendation: undefined,
                    region: undefined,
                    regionLatitude: undefined,
                    regionLongitude: undefined,
                },
                aiContent: {
                    estimatedDuration: '1 day',
                    confidenceScore: 0.6,
                },
                metadata: {
                    spotCount: 2,
                    sourceKeywords: ['test'],
                    generatedAt: new Date('2025-01-01T00:00:00Z'),
                    algorithm: 'test',
                },
                cluster: {
                    averageDistance: 0,
                    spots: [
                        {
                            touristSpotId: undefined,
                            touristSpotName: null,
                            touristSpotDesc: undefined,
                            latitude: undefined,
                            longitude: undefined,
                            touristSpotHashtag: undefined,
                        },
                    ],
                },
            };

            const incompleteResult = {
                generatedRoutes: [incompleteRoute],
                summary: {
                    totalSpotsFound: 0,
                    clustersFormed: 0,
                    routesGenerated: 0,
                    processingTimeMs: 100,
                },
            };

            const result = AiRouteRecommendationMapper.toResponseDto(
                incompleteResult,
                ['test'],
                false,
            );

            expect(result.generatedRoutes[0]).toEqual({
                modelRouteId: '',
                routeName: '',
                regionDesc: '',
                recommendations: [],
                region: '',
                regionLatitude: 0,
                regionLongitude: 0,
                estimatedDuration: '1 day',
                confidenceScore: 0.6,
                spotCount: 2,
                averageDistance: 0,
                touristSpots: [
                    {
                        touristSpotId: '',
                        touristSpotName: '',
                        touristSpotDesc: undefined,
                        latitude: 0,
                        longitude: 0,
                        touristSpotHashtag: [],
                        matchedKeywords: [],
                    },
                ],
                metadata: {
                    sourceKeywords: ['test'],
                    generatedAt: '2025-01-01T00:00:00.000Z',
                    algorithm: 'test',
                    aiGenerated: true,
                },
            });
        });

        it('should generate correct success message for multiple routes', () => {
            const multipleRoutesResult = {
                generatedRoutes: [mockGeneratedRoute, mockGeneratedRoute, mockGeneratedRoute],
                summary: mockResult.summary,
            };

            const result = AiRouteRecommendationMapper.toResponseDto(
                multipleRoutesResult,
                ['test'],
                true,
            );

            expect(result.message).toBe('Successfully generated 3 AI route recommendations');
        });

        it('should generate correct message for no routes', () => {
            const emptyResult = {
                generatedRoutes: [],
                summary: {
                    totalSpotsFound: 0,
                    clustersFormed: 0,
                    routesGenerated: 0,
                    processingTimeMs: 500,
                },
            };

            const result = AiRouteRecommendationMapper.toResponseDto(
                emptyResult,
                ['nonexistent'],
                true,
            );

            expect(result.message).toBe('No matching tourist spots found for the given keywords');
        });

        it('should correctly identify matched keywords', () => {
            const spotWithVariousHashtags = {
                ...mockGeneratedRoute,
                cluster: {
                    averageDistance: 10,
                    spots: [
                        {
                            touristSpotId: 'spot-1',
                            touristSpotName: 'Test Spot',
                            latitude: 35.0,
                            longitude: 139.0,
                            touristSpotHashtag: ['ANIME', 'culture', 'Traditional', 'Food'],
                        },
                    ],
                },
            };

            const testResult = {
                generatedRoutes: [spotWithVariousHashtags],
                summary: mockResult.summary,
            };

            const searchKeywords = ['anime', 'Culture', 'food', 'nonmatch'];

            const result = AiRouteRecommendationMapper.toResponseDto(
                testResult,
                searchKeywords,
                true,
            );

            const spot = result.generatedRoutes[0].touristSpots[0];
            expect(spot.matchedKeywords).toEqual(
                expect.arrayContaining(['anime', 'Culture', 'food']),
            );
            expect(spot.matchedKeywords).not.toContain('nonmatch');
        });

        it('should handle case-insensitive keyword matching', () => {
            const spot = {
                touristSpotId: 'test',
                touristSpotName: 'Test',
                latitude: 0,
                longitude: 0,
                touristSpotHashtag: ['ANIMATION', 'scenic'],
            };

            const testRoute = {
                ...mockGeneratedRoute,
                cluster: { averageDistance: 0, spots: [spot] },
            };

            const testResult = {
                generatedRoutes: [testRoute],
                summary: mockResult.summary,
            };

            const result = AiRouteRecommendationMapper.toResponseDto(
                testResult,
                ['animation', 'SCENIC'],
                true,
            );

            const resultSpot = result.generatedRoutes[0].touristSpots[0];
            expect(resultSpot.matchedKeywords).toEqual(['animation', 'SCENIC']);
        });

        it('should handle empty hashtags gracefully', () => {
            const spotWithEmptyHashtags = {
                touristSpotId: 'test',
                touristSpotName: 'Test',
                latitude: 0,
                longitude: 0,
                touristSpotHashtag: [],
            };

            const testRoute = {
                ...mockGeneratedRoute,
                cluster: { averageDistance: 0, spots: [spotWithEmptyHashtags] },
            };

            const testResult = {
                generatedRoutes: [testRoute],
                summary: mockResult.summary,
            };

            const result = AiRouteRecommendationMapper.toResponseDto(testResult, ['test'], true);

            const resultSpot = result.generatedRoutes[0].touristSpots[0];
            expect(resultSpot.matchedKeywords).toEqual([]);
            expect(resultSpot.touristSpotHashtag).toEqual([]);
        });

        it('should preserve summary data correctly', () => {
            const customSummary = {
                totalSpotsFound: 42,
                clustersFormed: 7,
                routesGenerated: 5,
                processingTimeMs: 3500,
            };

            const customResult = {
                generatedRoutes: [mockGeneratedRoute],
                summary: customSummary,
            };

            const result = AiRouteRecommendationMapper.toResponseDto(customResult, ['test'], false);

            expect(result.summary).toEqual({
                ...customSummary,
                aiAvailable: false,
            });
        });

        it('should handle mapping errors gracefully', () => {
            const invalidResult = {
                generatedRoutes: [
                    {
                        modelRoute: null,
                        aiContent: null,
                        metadata: null,
                        cluster: null,
                    },
                ],
                summary: mockResult.summary,
            };

            expect(() => {
                AiRouteRecommendationMapper.toResponseDto(invalidResult, ['test'], true);
            }).toThrow();
        });

        it('should handle large datasets efficiently', () => {
            const largeSpotArray = Array.from({ length: 100 }, (_, i) => ({
                touristSpotId: `spot-${i}`,
                touristSpotName: `Spot ${i}`,
                latitude: 35 + i * 0.01,
                longitude: 139 + i * 0.01,
                touristSpotHashtag: [`tag-${i}`, 'common'],
            }));

            const largeRoute = {
                ...mockGeneratedRoute,
                cluster: { averageDistance: 50, spots: largeSpotArray },
            };

            const largeResult = {
                generatedRoutes: [largeRoute],
                summary: mockResult.summary,
            };

            const startTime = Date.now();
            const result = AiRouteRecommendationMapper.toResponseDto(largeResult, ['common'], true);
            const endTime = Date.now();

            expect(result.generatedRoutes[0].touristSpots).toHaveLength(100);
            expect(endTime - startTime).toBeLessThan(50); // Should complete within 50ms
        });

        it('should correctly format dates to ISO strings', () => {
            const specificDate = new Date('2025-06-15T14:30:45.123Z');
            const routeWithSpecificDate = {
                ...mockGeneratedRoute,
                metadata: {
                    ...mockGeneratedRoute.metadata,
                    generatedAt: specificDate,
                },
            };

            const testResult = {
                generatedRoutes: [routeWithSpecificDate],
                summary: mockResult.summary,
            };

            const result = AiRouteRecommendationMapper.toResponseDto(testResult, ['test'], true);

            expect(result.generatedRoutes[0].metadata.generatedAt).toBe('2025-06-15T14:30:45.123Z');
        });

        it('should handle partial keyword matches correctly', () => {
            const spot = {
                touristSpotId: 'test',
                touristSpotName: 'Test',
                latitude: 0,
                longitude: 0,
                touristSpotHashtag: ['animation-studio', 'cultural-heritage'],
            };

            const testRoute = {
                ...mockGeneratedRoute,
                cluster: { averageDistance: 0, spots: [spot] },
            };

            const testResult = {
                generatedRoutes: [testRoute],
                summary: mockResult.summary,
            };

            const result = AiRouteRecommendationMapper.toResponseDto(
                testResult,
                ['animation', 'culture'],
                true,
            );

            const resultSpot = result.generatedRoutes[0].touristSpots[0];
            expect(resultSpot.matchedKeywords).toEqual(['animation', 'culture']);
        });
    });

    describe('Error Handling', () => {
        it('should log errors during mapping', () => {
            const loggerSpy = jest.spyOn(AiRouteRecommendationMapper['logger'], 'error');

            const invalidResult = {
                generatedRoutes: [null],
                summary: null,
            };

            expect(() => {
                AiRouteRecommendationMapper.toResponseDto(invalidResult, ['test'], true);
            }).toThrow();

            expect(loggerSpy).toHaveBeenCalledWith(
                'Failed to map route recommendation result to response DTO',
                expect.objectContaining({
                    error: expect.any(String),
                    routesCount: 1,
                }),
            );
        });

        it('should preserve original error when mapping fails', () => {
            const invalidResult = {
                generatedRoutes: [
                    {
                        modelRoute: {
                            regionLatitude: 'invalid-number',
                        },
                    },
                ],
                summary: mockResult.summary,
            };

            expect(() => {
                AiRouteRecommendationMapper.toResponseDto(invalidResult, ['test'], true);
            }).toThrow();
        });
    });
});
