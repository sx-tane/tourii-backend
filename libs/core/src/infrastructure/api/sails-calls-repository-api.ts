import { SailsCallsRepository } from '@app/core/domain/vara/sails/sails-calls-repository';
import {
  CONTRACT_ID,
  IDL,
  NETWORK,
  SPONSOR_MNEMONIC,
  SPONSOR_NAME,
} from '@app/core/domain/vara/vara-contract-constant';
import { SailsCommandOptionsRequestDto } from '@app/tourii-onchain/service/dto/sails/sails-command-options-request-dto';
import { SailsCommandResponseDto } from '@app/tourii-onchain/service/dto/sails/sails-command-response-dto';
import { SailsQueryOptionsRequestDto } from '@app/tourii-onchain/service/dto/sails/sails-query-options-request-dto';
import { SailsCalls } from 'sailscalls';

export class SailsCallsRepositoryApi implements SailsCallsRepository {
  // FIXME: Make it dynamic based on the contract
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

  async sailsCallsQuery(
    sailsCalls: SailsCalls,
    sailsQueryOptions: SailsQueryOptionsRequestDto,
  ): Promise<any> {
    return await sailsCalls.query({
      serviceName: sailsQueryOptions.serviceName,
      methodName: sailsQueryOptions.methodName,
      callArguments: sailsQueryOptions.callArguments,
    });
  }

  async sailsCallsCommand(
    sailsCalls: SailsCalls,
    sailsCommandOptionsRequestDto: SailsCommandOptionsRequestDto,
  ): Promise<SailsCommandResponseDto> {
    return await sailsCalls.command({
      signerData: sailsCommandOptionsRequestDto.signerData,
      voucherId: sailsCommandOptionsRequestDto.voucherId,
      serviceName: sailsCommandOptionsRequestDto.serviceName,
      methodName: sailsCommandOptionsRequestDto.methodName,
      callArguments: sailsCommandOptionsRequestDto.callArguments,
    });
  }
}
