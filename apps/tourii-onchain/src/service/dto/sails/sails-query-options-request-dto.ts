import { HexString } from '@gear-js/api';
import { ContractData, SailsCallbacks } from 'sailscalls';

export interface SailsQueryOptionsRequestDto {
    contractToCall?: ContractData | string;
    /**
     * ### Service name
     * Specify the name of the service to call
     */
    serviceName: string;
    /**
     * ### Service method name
     * Specify the name of the name from the service to call
     */
    methodName: string;
    /**
     * ## User address for the query
     * An address is required for queries, in this case,
     * the user address, if not specified, zero
     * address will be used
     */
    userAddress?: HexString;
    /**
     * ### Arguments, if any, for query method
     * Specify in the array all arguments for service method
     */
    callArguments?: any[];
    /**
     * ### Callbacks for each state of the command
     */
    callbacks?: SailsCallbacks;
}
