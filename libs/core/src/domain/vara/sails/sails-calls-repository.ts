import { SailsCommandOptionsRequestDto } from '@app/tourii-onchain/service/dto/sails/sails-command-options-request-dto';
import { SailsQueryOptionsRequestDto } from '@app/tourii-onchain/service/dto/sails/sails-query-options-request-dto';
import { SailsCalls } from 'sailscalls';

export interface SailsCallsRepository {
  /**
   * Initialize the SailsCalls instance.
   * @returns The SailsCalls instance.
   */
  initSailsCalls(): Promise<SailsCalls>;

  sailsCallsQuery(
    sailsCalls: SailsCalls,
    sailsQueryOptionsRequestDto: SailsQueryOptionsRequestDto,
  ): Promise<any>;

  sailsCallsCommand(
    sailsCalls: SailsCalls,
    sailsCommandOptionsRequestDto: SailsCommandOptionsRequestDto,
  ): Promise<any>;
}
