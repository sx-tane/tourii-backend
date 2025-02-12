import { HexString } from '@gear-js/api/types';

export interface JWTData {
  username: string;
  keyringAddress: HexString;
  keyringVoucherId: string;
  lockedKeyringData: any;
  password: string;
  iat?: number;
  exp?: number;
}
