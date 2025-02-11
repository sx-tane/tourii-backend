import type { RequestId } from "./request-id";


export interface ContextProvider {
  /**
   * RequestId
   *
   * @returns RequestId
   */
  getRequestId(): RequestId;
}
