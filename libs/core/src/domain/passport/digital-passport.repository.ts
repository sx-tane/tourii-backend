export interface DigitalPassportRepository {
    /**
     * Mint a digital passport NFT to the given wallet address.
     * @param to wallet address to mint to
     * @param metadataUrl metadata URI for the passport
     * @returns minted token ID and transaction hash
     */
    mint(to: string, metadataUrl: string): Promise<{ tokenId: string; txHash: string }>;

    /**
     * Get the next token ID that will be minted.
     * Useful for preparing metadata before minting.
     */
    getNextTokenId(): Promise<string>;
}
