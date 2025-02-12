import { HexString } from '@gear-js/api/types';

export const INITIAL_BLOCKS_FOR_VOUCHER: number = 1_200;
export const INITIAL_VOUCHER_TOKENS: number = 2;
export const VOUCHER_EXPIRATION_BLOCKS: number = 1_200;
export const NETWORK: string = 'wss://testnet.vara.network';
export const SPONSOR_NAME: string = 'admindavid';
// FIXME: Move this to env
export const SPONSOR_MNEMONIC: string =
  'strong orchard plastic arena pyramid lobster lonely rich stomach label clog rubber';
export const CONTRACT_ID: HexString =
  '0x17cf40e9dfde5ede9fd4c7314a25a63cb989751f8e3e3dd0d29c01baf31c6da6';
export const IDL: string = `
    type KeyringData = struct {
      address: str,
      encoded: str,
    };

    type KeyringEvent = enum {
      KeyringAccountSet,
      Error: KeyringError,
    };

    type KeyringError = enum {
      KeyringAddressAlreadyEsists,
      UserAddressAlreadyExists,
      UserCodedNameAlreadyExists,
      UserDoesNotHasKeyringAccount,
      KeyringAccountAlreadyExists,
      SessionHasInvalidCredentials,
      UserAndKeyringAddressAreTheSame,
    };

    type KeyringQueryEvent = enum {
      LastWhoCall: actor_id,
      SignlessAccountAddress: opt actor_id,
      SignlessAccountData: opt KeyringData,
    };

    type TrafficLightEvent = enum {
      Green,
      Yellow,
      Red,
      KeyringError: KeyringError,
    };

    type IoTrafficLightState = struct {
      current_light: str,
      all_users: vec struct { actor_id, str },
    };

    constructor {
      New : ();
    };

    service Keyring {
      BindKeyringDataToUserAddress : (user_address: actor_id, keyring_data: KeyringData) -> KeyringEvent;
      BindKeyringDataToUserCodedName : (user_coded_name: str, keyring_data: KeyringData) -> KeyringEvent;
      query KeyringAccountData : (keyring_address: actor_id) -> KeyringQueryEvent;
      query KeyringAddressFromUserAddress : (user_address: actor_id) -> KeyringQueryEvent;
      query KeyringAddressFromUserCodedName : (user_coded_name: str) -> KeyringQueryEvent;
    };

    service TrafficLight {
      Green : (user_coded_name: str) -> TrafficLightEvent;
      Red : (user_coded_name: str) -> TrafficLightEvent;
      Yellow : (user_coded_name: str) -> TrafficLightEvent;
      query TrafficLight : () -> IoTrafficLightState;
    };
`;
