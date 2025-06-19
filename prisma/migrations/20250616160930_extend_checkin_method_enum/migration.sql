-- Add new enum values to CheckInMethod
ALTER TYPE "CheckInMethod" ADD VALUE 'AUTO_DETECTED';
ALTER TYPE "CheckInMethod" ADD VALUE 'BACKGROUND_GPS';