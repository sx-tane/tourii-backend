import { SailsCallsRepository } from '@app/core/domain/vara/sails-calls-repository';
import {
  CONTRACT_ID,
  IDL,
  NETWORK,
  SPONSOR_MNEMONIC,
  SPONSOR_NAME,
} from '@app/core/domain/vara/vara-contract-constant';
import { SailsCalls } from 'sailscalls';

export class SailsCallsRepositoryApi implements SailsCallsRepository {
  async initSailsCalls(): Promise<SailsCalls> {
    return await SailsCalls.new({
      network: NETWORK,
      voucherSignerData: {
        sponsorMnemonic: SPONSOR_MNEMONIC,
        sponsorName: SPONSOR_NAME,
      },
      newContractsData: [
        {
          contractName: 'traffic_light',
          address: CONTRACT_ID,
          idl: IDL,
        },
      ],
    });
  }
}
