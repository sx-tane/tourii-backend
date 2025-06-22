import { TouriiBackendAppErrorType } from '../support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '../support/exception/tourii-backend-app-exception';

/**
 * File validation utilities for secure file processing
 */
export class FileValidationUtils {
    // Maximum file sizes in bytes
    private static readonly MAX_FILE_SIZES = {
        photo: 10 * 1024 * 1024, // 10MB
        audio: 50 * 1024 * 1024, // 50MB
        text: 10 * 1024, // 10KB for text content
    };

    // Allowed MIME types for each interaction type
    private static readonly ALLOWED_MIME_TYPES = {
        photo: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/x-wav'],
    };

    // MIME type signatures for validation
    private static readonly MIME_SIGNATURES = {
        // JPEG
        'image/jpeg': [[0xff, 0xd8, 0xff]],
        // PNG
        'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
        // WebP
        'image/webp': [
            [0x52, 0x49, 0x46, 0x46], // RIFF
        ],
        // GIF
        'image/gif': [
            [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
            [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
        ],
        // MP3
        'audio/mpeg': [
            [0x49, 0x44, 0x33], // ID3
            [0xff, 0xfb], // MP3 frame
            [0xff, 0xf3], // MP3 frame
            [0xff, 0xf2], // MP3 frame
        ],
        // WAV
        'audio/wav': [
            [0x52, 0x49, 0x46, 0x46], // RIFF
        ],
        // OGG
        'audio/ogg': [
            [0x4f, 0x67, 0x67, 0x53], // OggS
        ],
    };

    /**
     * Validate base64 string format
     * @param base64String The base64 string to validate
     * @returns True if valid base64 format
     */
    public static isValidBase64(base64String: string): boolean {
        try {
            // Check if string contains only valid base64 characters
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (!base64Regex.test(base64String)) {
                return false;
            }

            // Try to decode to verify it's valid base64
            const buffer = Buffer.from(base64String, 'base64');
            return Buffer.from(buffer.toString('base64'), 'base64').equals(buffer);
        } catch {
            return false;
        }
    }

    /**
     * Detect MIME type from file buffer using magic numbers
     * @param buffer The file buffer
     * @returns Detected MIME type or null if not recognized
     */
    public static detectMimeType(buffer: Buffer): string | null {
        if (!buffer || buffer.length === 0) {
            return null;
        }

        for (const [mimeType, signatures] of Object.entries(FileValidationUtils.MIME_SIGNATURES)) {
            for (const signature of signatures) {
                if (FileValidationUtils.matchesSignature(buffer, signature)) {
                    return mimeType;
                }
            }
        }

        return null;
    }

    /**
     * Check if buffer matches a specific signature
     * @param buffer The file buffer
     * @param signature The byte signature to match
     * @returns True if buffer starts with the signature
     */
    private static matchesSignature(buffer: Buffer, signature: number[]): boolean {
        if (buffer.length < signature.length) {
            return false;
        }

        for (let i = 0; i < signature.length; i++) {
            if (buffer[i] !== signature[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Validate file content for local interaction tasks
     * @param interactionType The type of interaction (text, photo, audio)
     * @param content The content to validate
     * @throws TouriiBackendAppException if validation fails
     */
    public static validateLocalInteractionContent(
        interactionType: 'text' | 'photo' | 'audio',
        content: string,
    ): void {
        // Validate content is not empty
        if (!content || content.trim().length === 0) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        if (interactionType === 'text') {
            FileValidationUtils.validateTextContent(content);
        } else {
            FileValidationUtils.validateFileContent(interactionType, content);
        }
    }

    /**
     * Validate text content
     * @param content The text content to validate
     */
    private static validateTextContent(content: string): void {
        // Check text length
        if (content.length > FileValidationUtils.MAX_FILE_SIZES.text) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        // Check for potentially malicious content patterns
        const suspiciousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /data:text\/html/gi,
            /vbscript:/gi,
        ];

        for (const pattern of suspiciousPatterns) {
            if (pattern.test(content)) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
            }
        }
    }

    /**
     * Validate file content (photo/audio)
     * @param interactionType The interaction type (photo or audio)
     * @param base64Content The base64 encoded content
     */
    private static validateFileContent(
        interactionType: 'photo' | 'audio',
        base64Content: string,
    ): void {
        // Validate base64 format
        if (!FileValidationUtils.isValidBase64(base64Content)) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        // Decode and validate file
        let fileBuffer: Buffer;
        try {
            fileBuffer = Buffer.from(base64Content, 'base64');
        } catch {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        // Check file size
        const maxSize = FileValidationUtils.MAX_FILE_SIZES[interactionType];
        if (fileBuffer.length > maxSize) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        // Detect actual MIME type
        const detectedMimeType = FileValidationUtils.detectMimeType(fileBuffer);
        if (!detectedMimeType) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        // Validate MIME type matches interaction type
        const allowedMimeTypes = FileValidationUtils.ALLOWED_MIME_TYPES[interactionType];
        if (!allowedMimeTypes.includes(detectedMimeType)) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }
    }

    /**
     * Get the appropriate file extension for a MIME type
     * @param mimeType The MIME type
     * @returns The file extension (with dot)
     */
    public static getFileExtensionFromMimeType(mimeType: string): string {
        const extensionMap: Record<string, string> = {
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp',
            'image/gif': '.gif',
            'audio/mpeg': '.mp3',
            'audio/mp3': '.mp3',
            'audio/wav': '.wav',
            'audio/x-wav': '.wav',
            'audio/m4a': '.m4a',
            'audio/ogg': '.ogg',
        };

        return extensionMap[mimeType] || '.bin';
    }

    /**
     * Validate and get MIME type for upload
     * @param interactionType The interaction type
     * @param base64Content The base64 content
     * @returns The validated MIME type
     */
    public static validateAndGetMimeType(
        interactionType: 'photo' | 'audio',
        base64Content: string,
    ): string {
        FileValidationUtils.validateFileContent(interactionType, base64Content);

        const fileBuffer = Buffer.from(base64Content, 'base64');
        const mimeType = FileValidationUtils.detectMimeType(fileBuffer);

        if (!mimeType) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        return mimeType;
    }
}
