import { z } from 'zod';

/**
 * Common metadata fields for response models
 * These will be spread into the schemas rather than nested
 */
export const MetadataFieldsSchema = {
    delFlag: z.boolean().optional().describe('Flag to indicate if the record is deleted'),
    insUserId: z.string().optional().describe('ID of user who created this record'),
    insDateTime: z.string().optional().describe('Timestamp of record creation'),
    updUserId: z.string().optional().describe('ID of user who last updated this record'),
    updDateTime: z.string().optional().describe('Timestamp of last record update'),
};
