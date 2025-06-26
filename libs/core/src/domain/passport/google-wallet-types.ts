export interface GooglePassObject {
    genericObjects: Array<{
        id: string;
        classId: string;
        state: 'ACTIVE' | 'INACTIVE';
        barcode?: {
            type: 'QR_CODE' | 'CODE_128' | 'CODE_39';
            value: string;
            renderEncoding?: string;
            alternateText?: string;
        };
        cardTitle: {
            defaultValue: {
                language: string;
                value: string;
            };
            translatedValues?: Array<{
                language: string;
                value: string;
            }>;
        };
        header: {
            defaultValue: {
                language: string;
                value: string;
            };
        };
        subheader: {
            defaultValue: {
                language: string;
                value: string;
            };
        };
        textModulesData: Array<{
            id: string;
            header: string;
            body: string;
        }>;
        hexBackgroundColor: string;
        logo?: {
            sourceUri: {
                uri: string;
            };
            contentDescription?: {
                defaultValue: {
                    language: string;
                    value: string;
                };
            };
        };
    }>;
}
