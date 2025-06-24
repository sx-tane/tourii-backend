import { OnchainItemType, BlockchainType } from '@prisma/client';
import { Entity } from '../entity';

interface OnchainItemCatalogProps {
    itemType: OnchainItemType;
    blockchainType: BlockchainType;
    nftName: string;
    nftDescription: string;
    imageUrl: string;
    contractAddress: string;
    tokenId?: string;
    metadataUrl?: string;
    attributes: any[];
    releaseDate?: Date;
    expiryDate?: Date;
    maxSupply?: number;
    delFlag: boolean;
    insUserId: string;
    insDateTime: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class OnchainItemCatalog extends Entity<OnchainItemCatalogProps> {
    constructor(props: OnchainItemCatalogProps, id?: string) {
        super(props, id);
    }

    get onchainItemId(): string | undefined {
        return this.id;
    }

    get itemType(): OnchainItemType {
        return this.props.itemType;
    }

    get blockchainType(): BlockchainType {
        return this.props.blockchainType;
    }

    get nftName(): string {
        return this.props.nftName;
    }

    get nftDescription(): string {
        return this.props.nftDescription;
    }

    get imageUrl(): string {
        return this.props.imageUrl;
    }

    get contractAddress(): string {
        return this.props.contractAddress;
    }

    get tokenId(): string | undefined {
        return this.props.tokenId;
    }

    get metadataUrl(): string | undefined {
        return this.props.metadataUrl;
    }

    get attributes(): any[] {
        return this.props.attributes;
    }

    get releaseDate(): Date | undefined {
        return this.props.releaseDate;
    }

    get expiryDate(): Date | undefined {
        return this.props.expiryDate;
    }

    get maxSupply(): number | undefined {
        return this.props.maxSupply;
    }

    get delFlag(): boolean {
        return this.props.delFlag;
    }

    get insUserId(): string {
        return this.props.insUserId;
    }

    get insDateTime(): Date {
        return this.props.insDateTime;
    }

    get updUserId(): string {
        return this.props.updUserId;
    }

    get updDateTime(): Date {
        return this.props.updDateTime;
    }

    get requestId(): string | undefined {
        return this.props.requestId;
    }

    /**
     * Check if item is a perk type
     * @returns True if item is a perk
     */
    isPerk(): boolean {
        return this.props.itemType === OnchainItemType.PERK;
    }

    /**
     * Check if item is available for purchase
     * @returns True if item is available
     */
    isAvailable(): boolean {
        const now = new Date();
        
        // Check if released
        if (this.props.releaseDate && this.props.releaseDate > now) {
            return false;
        }
        
        // Check if expired
        if (this.props.expiryDate && this.props.expiryDate < now) {
            return false;
        }
        
        // Check if not deleted
        return !this.props.delFlag;
    }

    /**
     * Check if item has supply limit
     * @returns True if item has max supply limit
     */
    hasSupplyLimit(): boolean {
        return this.props.maxSupply !== undefined && this.props.maxSupply > 0;
    }

    /**
     * Get days until expiry
     * @returns Number of days until expiry (null if no expiry)
     */
    getDaysUntilExpiry(): number | null {
        if (!this.props.expiryDate) return null;
        
        const now = new Date();
        const diffTime = this.props.expiryDate.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}