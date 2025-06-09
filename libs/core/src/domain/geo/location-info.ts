export interface LocationInfo {
    name: string;
    formattedAddress?: string;
    phoneNumber?: string;
    website?: string;
    rating?: number;
    googleMapsUrl?: string;
    openingHours?: string[];
    images?: LocationImage[];
}

export interface LocationImage {
    url: string;
    width: number;
    height: number;
    photoReference: string;
}
