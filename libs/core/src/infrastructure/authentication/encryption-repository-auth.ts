import * as crypto from 'node:crypto';
import { EncryptionRepository } from '@app/core/domain/auth/encryption.repository';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { HexString } from '@gear-js/api/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Keyring } from '@polkadot/api';
import { u8aToHex } from '@polkadot/util';

@Injectable()
export class EncryptionRepositoryAuth implements EncryptionRepository {
    private readonly secretKey: Buffer;
    constructor(protected readonly configService: ConfigService) {
        const key = this.configService.get<string>('ENCRYPTION_KEY');
        if (!key) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_041);
        }
        this.secretKey = crypto.createHash('sha256').update(key).digest();
    }

    encryptString(text: string): string {
        const algorithm = 'aes-256-ctr';
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, this.secretKey, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }

    decryptString(text: string): string {
        const algorithm = 'aes-256-ctr';
        const [ivHex, contentHex] = text.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(contentHex, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, this.secretKey, iv);
        const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
        return decrypted.toString('utf8');
    }

    decodeAddress(publicKey: string): HexString {
        return u8aToHex(new Keyring().decodeAddress(publicKey));
    }
}
