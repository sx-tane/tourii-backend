import { HexString } from '@gear-js/api/types';
import type { IKeyringPair } from '@polkadot/types/types';
import { SailsCalls } from 'sailscalls';

export interface SailsCallsRepository {
  /**
   * Initialize the SailsCalls instance.
   * @returns The SailsCalls instance.
   */
  initSailsCalls(): Promise<SailsCalls>;

  sailsCallsCommand(voucherId: HexString, signer: IKeyringPair): Promise<any>;
  sailsCallsQuery(): Promise<any>;
  sailsCallsCreateVoucher(): Promise<string>;
}
