export interface PassportChildLinkRepository {
    findLinksByPassportTokenId(passportTokenId: string): Promise<{
        child_token_id: string;
        child_type: string;
    }[]>;
}
