import * as crypto from 'node:crypto';
import { EncryptionRepository } from '@app/core/domain/auth/encryption.repository';
import { HexString } from '@gear-js/api/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Keyring } from '@polkadot/api';
import { u8aToHex } from '@polkadot/util';

@Injectable()
export class EncryptionRepositoryAuth implements EncryptionRepository {
  private readonly secretKey: string;
  constructor(protected readonly configService: ConfigService) {
    this.secretKey =
      this.configService.get<string>('ENCRYPTION_KEY') || 'defaultSecretKey';
  }

  encryptString(text: string): string {
    const algorithm = 'aes-256-ctr';
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, this.secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decodeAddress(publicKey: string): HexString {
    return u8aToHex(new Keyring().decodeAddress(publicKey));
  }
}
