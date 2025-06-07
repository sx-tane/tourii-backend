export interface DigitalPassportRepository {
    /**
     * Mint a digital passport NFT to the given wallet address.
     * @param to wallet address to mint to
     * @returns minted token ID and transaction hash
     */
    mint(to: string): Promise<{ tokenId: string; txHash: string }>;
}
