import { HexString } from '@gear-js/api';
import {
    AccountSigner,
    ContractData,
    GasLimitType,
    SailsCallbacks,
} from 'sailscalls';

export interface SailsCommandOptionsRequestDto {
    /**
     * ### Signer data
     * The account to sign can be obtained from the extension, by creating
     * a new keyringpair account or by obtaining it from the contract (in
     * case of storing it in it)
     */
    signerData: AccountSigner;
    /**
     * ### Contract to call - OPTIONAL
     * - If you dont pass to this attribute, SailsCalls will use the first
     *   contract data stored (SailsCalls stores contracts inside an object
     *    literal, with key being the name of the contract).
     * - If you give a string, SailsCalls will search to the stored
     *   contract to call, if not exists, it will notify to the user
     * - If you give contract data, SailsCalls will crate a temporary
     *   instance of Sails-js to send the menssage to the given contract
     * @example
     * // Example 1, give the name of the stored contract
     * const commandOptions: SailsCommandOptions = {
     *     //attributes ...
     *     contractToCall: 'PingContract', // Set the name of the contract
     *     //attributes ...
     * }
     *
     * // Example 2, give the contract data to send the message
     * const commandOptions: SailsCommandOptions = {
     *     //attributes ...
     *     contractToCall: { // Set the contract data to send the message
     *         address: '0x...', // Cotract id to send the message
     *         idl: `...` // Contract idl
     *     },
     *     //attributes ...
     * }
     */
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
     * ### Arguments, if any, for command method - OPTIONAL
     * Specify in the array all arguments for service method
     *
     * The attribute is optional, can be discarded
     */
    callArguments?: any[];
    /**
     * ## Value (tokens) associated with the message - OPTIONAL
     *
     * The attribute is optional, can be discarded
     * @example
     * const options: SailsCommandOptions = {
     *     // One token
     *     tokensToSend: 1_000_000_000_000n
     * };
     */
    tokensToSend?: bigint;
    /**
     * ### Voucher id that will be used in the current message - OPTIONAL
     * If voucher id is set, it will be used for current message (HexString).
     *
     * The attribute is optional, can be discarded
     */
    voucherId?: HexString;
    /**
     * ### Set the gas fees to spend in the message - OPTIONAL
     * If not provided, gas will be calculated automatically without extra gas fees.
     * You can set the gas limit in two ways:
     * - As a number, it will be the gas limit to spend in the message
     * - As an object, it will be the extra gas fees in porcentage to spend in the message,
     *   for example, if you set 10, it will be 10% of the gas limit to spend in the message
     *
     * The attribute is optional, can be ommited
     *
     * @example
     * // 1- Set the gas limit to spend in the message
     * const options = SailsCommandOptions = {
     *     gasLimit: 1_000_000n // Set the gas limit to spend in the message
     * };
     *
     * // 2- Set extra gas fees in porcentage
     * const options = SailsCommandOptions = {
     *    gasLimit: {
     *        // adds 10% extra gas fees to the calculated gas fees
     *        extraGasInCalculatedGasFees: 10
     *    }
     * };
     */
    gasLimit?: GasLimitType;
    /**
     * ### Callbacks for each state of the command
     * Callback available:
     * - onSuccess
     * - onError
     * - onLoad
     * - onBlock
     * - onSuccessAsync
     * - onErrorAsync
     * - onLoadAsync
     * - onBlockAsync
     */
    callbacks?: SailsCallbacks;
    /**
     * ### Active some informative logs
     */
    enableLogs?: boolean;
}
