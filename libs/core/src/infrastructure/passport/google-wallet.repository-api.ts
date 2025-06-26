import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

// Repository/Integration for Google Wallet API
@Injectable()
export class GoogleWalletRepositoryApi {
    private credentials: any;
    private issuerId: string;
    private classId: string;
    private walletApi: any;

    constructor(private readonly config: ConfigService) {
        // --- GOOGLE WALLET PRODUCTION SETUP ---
        // Try environment variable first, then fall back to file path
        const serviceAccountJson = this.config.get<string>('GOOGLE_WALLET_SERVICE_ACCOUNT_JSON');
        
        if (serviceAccountJson) {
            // Use JSON from environment variable
            this.credentials = JSON.parse(serviceAccountJson);
        } else {
            // Fall back to file path method
            const keyPath = this.config.get<string>('GOOGLE_WALLET_KEY_PATH') || 'google-wallet-key.json';
            this.credentials = JSON.parse(readFileSync(keyPath, 'utf8'));
        }
        
        this.issuerId = this.config.get<string>('GOOGLE_WALLET_ISSUER_ID') || '3388000000022942524';
        this.classId = this.config.get<string>('GOOGLE_WALLET_CLASS_ID') || 'tourii_passport';
        this.walletApi = google.walletobjects({ version: 'v1', auth: this.credentials });
        // --- END GOOGLE WALLET PRODUCTION SETUP ---
    }

    async ensureClassExists(classTemplate: any) {
        try {
            // Try to get the class using the full class ID from template
            const fullClassId = classTemplate.id || `${this.issuerId}.${this.classId}`;
            await this.walletApi.genericclass.get({ resourceId: fullClassId });
        } catch (err: any) {
            if (err.code === 404) {
                // Class does not exist, create it
                await this.walletApi.genericclass.insert({ requestBody: classTemplate });
            } else {
                throw err;
            }
        }
    }

    async createOrUpdatePassObject(objectId: string, objectTemplate: any) {
        try {
            // Try to get the object
            await this.walletApi.genericobject.get({ resourceId: objectId });
            // If exists, update
            await this.walletApi.genericobject.update({
                resourceId: objectId,
                requestBody: objectTemplate,
            });
        } catch (err: any) {
            if (err.code === 404) {
                // Object does not exist, create it
                await this.walletApi.genericobject.insert({ requestBody: objectTemplate });
            } else {
                throw err;
            }
        }
    }

    createSignedJwt(passObject: any): string {
        // --- GOOGLE WALLET PRODUCTION SETUP ---
        // TODO: Use your service account private key and set alg: 'RS256'
        const claims = {
            iss: this.credentials.client_email,
            aud: 'google',
            origins: [],
            typ: 'savetowallet',
            payload: passObject,
        };
        const token = jwt.sign(claims, this.credentials.private_key, { algorithm: 'RS256' });
        // --- END GOOGLE WALLET PRODUCTION SETUP ---
        return token;
    }

    getSaveUrl(jwt: string): string {
        return `https://pay.google.com/gp/v/save/${jwt}`;
    }
}
