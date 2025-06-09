import { LocationInfo } from '@app/core/domain/geo/location-info';
import { LocationInfoResponseDto } from '@app/tourii-backend/controller/model/tourii-response/location-info-response.model';

export class LocationInfoResultBuilder {
    static locationInfoToDto(locationInfo: LocationInfo): LocationInfoResponseDto {
        return {
            name: locationInfo.name,
            formattedAddress: locationInfo.formattedAddress,
            phoneNumber: locationInfo.phoneNumber,
            website: locationInfo.website,
            rating: locationInfo.rating,
            googleMapsUrl: locationInfo.googleMapsUrl,
            openingHours: locationInfo.openingHours,
            images: locationInfo.images?.map((image) => ({
                url: image.url,
                width: image.width,
                height: image.height,
                photoReference: image.photoReference,
            })),
        };
    }
}
