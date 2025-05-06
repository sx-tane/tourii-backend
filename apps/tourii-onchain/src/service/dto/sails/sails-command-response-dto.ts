import { HexString } from '@gear-js/api';

export interface SailsCommandResponseDto {
    /**
     * ## The id of the sent message.
     */
    msgId: HexString;
    /**
     * ## The blockhash of the block that contains the transaction.
     */
    blockHash: HexString;
    /**
     * ## The transaction hash.
     */
    txHash: HexString;
    /**
     * ## Response of the contract
     *
     * This field gives you the contract response, you can see the contract IDL to check the contract response type
     */
    response: any;
}
