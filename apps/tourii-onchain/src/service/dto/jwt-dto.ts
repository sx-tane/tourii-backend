import { HexString } from '@gear-js/api/types';
import { KeyringPair$Json } from '@polkadot/keyring/types';

export interface JWTData {
  username: string;
  keyringAddress: HexString;
  keyringVoucherId: HexString;
  lockedKeyringData: KeyringPair$Json;
  password: string;
}
