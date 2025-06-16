import { LocationInfoRepositoryApi } from './location-info-repository-api';
import { TouriiBackendHttpService } from '@app/core/provider/tourii-backend-http-service';
import { ConfigService } from '@nestjs/config';
import { CachingService } from '@app/core/provider/caching.service';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { LocationInfo } from '@app/core/domain/geo/location-info';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';

describe('LocationInfoRepositoryApi', () => {
  let repository: LocationInfoRepositoryApi;
  let httpService: { getTouriiBackendHttpService: { get: jest.Mock } };
  let configService: { get: jest.Mock };
  let cachingService: { getOrSet: jest.Mock };

  beforeEach(async () => {
    httpService = { getTouriiBackendHttpService: { get: jest.fn() } };
    configService = { get: jest.fn() };
    cachingService = { getOrSet: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationInfoRepositoryApi,
        { provide: TouriiBackendHttpService, useValue: httpService },
        { provide: ConfigService, useValue: configService },
        { provide: CachingService, useValue: cachingService },
      ],
    }).compile();

    repository = module.get(LocationInfoRepositoryApi);
  });

  it('throws E_GEO_005 when API key is missing', async () => {
    configService.get.mockReturnValue(undefined);
    await expect(repository.getLocationInfo('Tokyo')).rejects.toEqual(
      expect.objectContaining({
        response: expect.objectContaining({ code: TouriiBackendAppErrorType.E_GEO_005.code }),
      }),
    );
  });

  it('fetches location info from Google Places and caches it', async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'GOOGLE_PLACES_API_KEY') return 'test-key';
      return undefined;
    });

    // Mock the enhanced text search response (Strategy 2 - textsearch API) - return empty to force fallback
    const enhancedTextSearchResponse = {
      data: { results: [] },
      status: 200,
    };
    
    // Mock the basic text search response (Strategy 3 - findplacefromtext API)
    const findResponse = {
      data: { candidates: [{ place_id: 'abc123' }] },
      status: 200,
    };
    
    // Mock the place details response
    const detailResponse = {
      data: {
        result: {
          name: 'Sakura-tei',
          formatted_address: 'Tokyo, Japan',
          international_phone_number: '+81 3-3479-0039',
          website: 'https://www.sakuratei.co.jp',
          rating: 4,
          url: 'https://maps.google.com/?cid=12345',
          opening_hours: { weekday_text: ['Mon: 11AM-11PM'] },
        },
      },
      status: 200,
    };

    // Mock the HTTP calls in order: enhanced text search (fails), basic text search (succeeds), place details
    httpService.getTouriiBackendHttpService.get
      .mockReturnValueOnce(of(enhancedTextSearchResponse))
      .mockReturnValueOnce(of(findResponse))
      .mockReturnValueOnce(of(detailResponse));

    cachingService.getOrSet.mockImplementation(
      async (_key: string, fn: () => Promise<LocationInfo>) => fn(),
    );

    const result = await repository.getLocationInfo('Sakura-tei');

    expect(result).toEqual({
      name: 'Sakura-tei',
      formattedAddress: 'Tokyo, Japan',
      phoneNumber: '+81 3-3479-0039',
      website: 'https://www.sakuratei.co.jp',
      rating: 4,
      googleMapsUrl: 'https://maps.google.com/?cid=12345',
      openingHours: ['Mon: 11AM-11PM'],
    });

    expect(cachingService.getOrSet).toHaveBeenCalled();
    expect(httpService.getTouriiBackendHttpService.get).toHaveBeenCalledTimes(3);
  });
});
