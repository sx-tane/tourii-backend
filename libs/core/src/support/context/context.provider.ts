import type { RequestId } from './request-id';

export interface ContextProvider {
    /**
     * RequestId
     *
     * @returns RequestId
     */
    getRequestId(): RequestId | undefined;

    /**
     * Get the current system date and time
     *
     * @returns The current system date and time
     */
    getSystemDateTimeJST(): Date;
}
