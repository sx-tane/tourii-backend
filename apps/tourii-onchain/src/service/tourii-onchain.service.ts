import { EncryptionRepository } from '@app/core/domain/auth/encryption.repository';
import { JWTData } from '@app/core/domain/auth/jwt';
import { JwtRepository } from '@app/core/domain/auth/jwt.repository';
import { SailsCallsRepository } from '@app/core/domain/vara/sails-calls-repository';
import type { HexString } from '@gear-js/api/types';
import { Injectable, Logger } from '@nestjs/common';
import { INITIAL_BLOCKS_FOR_VOUCHER, INITIAL_VOUCHER_TOKENS } from '../consts';
import { GearApiRepository } from '../infrastructure/api/api-gearjs/gear-api.repository';
import keyringModel from '../models/keyringModel';
import trafficLightContractModel from '../models/trafficLightContractModel';

@Injectable()
export class TouriiOnchainService {
  constructor(
    private readonly sailsCallsRepository: SailsCallsRepository,
    private readonly gearApiRepository: GearApiRepository,
    private readonly jwtRepository: JwtRepository,
    private readonly encryptionRepository: EncryptionRepository,
  ) {}

  async initSailsCalls() {
    await this.sailsCallsRepository.initSailsCalls();
  }

  async initGearApi(network: string) {
    await this.gearApiRepository.initGearApi(network);
  }

  async sendGreen(token: string) {
    const userData = (await this.jwtRepository.dataFromToken(token)) as JWTData;
    const sailscalls = this.sailsCallsRepository.initSailsCalls();

    if (!sailscalls) {
      throw new Error('SailsCalls is not ready');
    }

    try {
      const voucherBalance = await sailscalls.voucherBalance(
        userData.keyringVoucherId as HexString,
      );

      if (voucherBalance < 1) {
        await sailscalls.addTokensToVoucher({
          userAddress: userData.keyringAddress,
          voucherId: userData.keyringVoucherId,
          numOfTokens: 1,
        });
      }
    } catch (e) {
      throw new Error(
        `Error while trying to add tokens to voucher: ${JSON.stringify(e)}`,
      );
    }

    try {
      const voucherIsExpired = await sailscalls.voucherIsExpired(
        userData.keyringAddress,
        userData.keyringVoucherId as HexString,
      );

      if (voucherIsExpired) {
        await sailscalls.renewVoucherAmountOfBlocks({
          userAddress: userData.keyringAddress,
          voucherId: userData.keyringVoucherId,
          numOfBlocks: 1_200,
        });
      }
    } catch (e) {
      throw new Error('Error while renewing voucher: ' + JSON.stringify(e));
    }

    const unlockKeyringData = sailscalls.unlockKeyringPair(
      userData.lockedKeyringData,
      userData.password,
    );
    const response = await trafficLightContractModel.sendGreen(
      this.encryptionRepository.encryptString(userData.username),
      userData.keyringVoucherId as HexString,
      unlockKeyringData,
    );

    return response;
  }

  async sendYellow(token: string) {
    const userData = (await this.jwtRepository.dataFromToken(token)) as JWTData;
    const sailscalls = this.sailsCallsRepository.initSailsCalls();

    if (!sailscalls) {
      throw new Error('SailsCalls is not ready');
    }

    // Implement the logic for sending yellow signal
    // Similar to sendGreen method
  }

  async sendRed(token: string) {
    const userData = (await this.jwtRepository.dataFromToken(token)) as JWTData;
    const sailscalls = this.sailsCallsRepository.initSailsCalls();

    if (!sailscalls) {
      throw new Error('SailsCalls is not ready');
    }

    try {
      const voucherIsExpired = await sailscalls.voucherIsExpired(
        userData.keyringAddress,
        userData.keyringVoucherId as HexString,
      );

      if (voucherIsExpired) {
        await sailscalls.renewVoucherAmountOfBlocks({
          userAddress: userData.keyringAddress,
          voucherId: userData.keyringVoucherId,
          numOfBlocks: 1_200,
        });
      }
    } catch (e) {
      throw new Error(`Error while renewing voucher: ${JSON.stringify(e)}`);
    }

    const unlockKeyringData = sailscalls.unlockKeyringPair(
      userData.lockedKeyringData,
      userData.password,
    );
    const response = await trafficLightContractModel.sendRed(
      this.encryptionRepository.encryptString(userData.username),
      userData.keyringVoucherId as HexString,
      unlockKeyringData,
    );

    return response;
  }

  async readState() {
    const sailscalls = this.sailsCallsRepository.initSailsCalls();

    if (!sailscalls) {
      throw new Error('SailsCalls is not ready');
    }

    const response = await trafficLightContractModel.readState();
    return response;
  }

  async userKeyringAddress(token: string) {
    const sailscalls = this.sailsCallsRepository.initSailsCalls();

    if (!sailscalls) {
      throw new Error('SailsCalls is not ready');
    }

    const data = (await this.jwtRepository.dataFromToken(token)) as JWTData;
    const hashedUsername = this.encryptionRepository.encryptString(
      data.username,
    );
    const userKeyringAddress =
      await keyringModel.userKeyringAddress(hashedUsername);

    return userKeyringAddress;
  }

  async loginUser(username: string, password: string) {
    const sailscalls = this.sailsCallsRepository.initSailsCalls();

    if (!sailscalls) {
      throw new Error('SailsCalls is not ready');
    }

    const hashedUsername = this.encryptionRepository.encryptString(username);
    const hashedPassword = this.encryptionRepository.encryptString(password);

    const userKeyringAddress =
      await keyringModel.userKeyringAddress(hashedUsername);

    if (!userKeyringAddress) {
      throw new Error('User is not registered');
    }

    const formatedKeyringData = await keyringModel.userKeyringData(
      userKeyringAddress as HexString,
    );
    let lockedKeyringData;

    try {
      lockedKeyringData = sailscalls.formatContractSignlessData(
        formatedKeyringData,
        username,
      );
      sailscalls.unlockKeyringPair(lockedKeyringData, hashedPassword);
    } catch (e) {
      throw new Error('Bad credentials');
    }

    const vouchersId = await sailscalls.vouchersInContract(
      userKeyringAddress as HexString,
    );

    const token = this.jwtRepository.generateJwtToken(
      {
        username,
        keyringAddress: userKeyringAddress,
        keyringVoucherId: vouchersId[0],
        lockedKeyringData,
        password: hashedPassword,
      },
      { expiresIn: '1h' },
    );

    return token;
  }

  async registerUser(username: string, password: string) {
    const sailscalls = this.sailsCallsRepository.initSailsCalls();

    if (!sailscalls) {
      throw new Error('SailsCalls is not ready');
    }

    const hashedUsername = this.encryptionRepository.encryptString(username);
    const hashedPassword = this.encryptionRepository.encryptString(password);

    const userKeyringAddress =
      await keyringModel.userKeyringAddress(hashedUsername);

    if (userKeyringAddress) {
      throw new Error('User already exists');
    }

    const newKeyringPair = await sailscalls.createNewKeyringPair(username);
    const lockedSignlessAccount = await sailscalls.lockkeyringPair(
      newKeyringPair,
      hashedPassword,
    );
    const formatedLockedSignlessAccount = sailscalls.modifyPairToContract(
      lockedSignlessAccount,
    );

    let keyringVoucherId = '';
    try {
      keyringVoucherId = await sailscalls.createVoucher({
        userAddress: this.encryptionRepository.decodeAddress(
          newKeyringPair.address,
        ),
        initialExpiredTimeInBlocks: INITIAL_BLOCKS_FOR_VOUCHER,
        initialTokensInVoucher: INITIAL_VOUCHER_TOKENS,
        callbacks: {
          onLoad() {
            Logger.log('Issue voucher to signless account...');
          },
          onSuccess() {
            Logger.log('Voucher created for signless account!');
          },
          onError() {
            Logger.log('Error while issue voucher to signless');
          },
        },
      });
    } catch (e) {
      Logger.log('Error while issue a voucher to a singless account!');
      Logger.log(e);
      throw new Error('Error while issue a voucher to a singless account!');
    }

    await keyringModel.registerUser(
      newKeyringPair,
      keyringVoucherId as HexString,
      hashedUsername,
      formatedLockedSignlessAccount,
    );

    const token = this.jwtRepository.generateJwtToken(
      {
        username,
        keyringAddress: this.encryptionRepository.decodeAddress(
          newKeyringPair.address,
        ),
        keyringVoucherId,
        lockedKeyringData: lockedSignlessAccount,
        password: hashedPassword,
      },
      { expiresIn: '1h' },
    );

    return token;
  }
}
