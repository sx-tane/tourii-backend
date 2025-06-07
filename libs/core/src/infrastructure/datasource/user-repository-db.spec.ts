import { cleanDb } from '@app/core-test/prisma/clean-db';
import { UserEntity } from '@app/core/domain/user/user.entity';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Test, type TestingModule } from '@nestjs/testing';
import { UserRepositoryDb } from './user-repository-db';

/**
 * Simple integration test for {@link UserRepositoryDb}
 */
describe('UserRepositoryDb', () => {
    let repository: UserRepositoryDb;
    let prisma: PrismaService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrismaService, UserRepositoryDb],
        }).compile();

        repository = module.get(UserRepositoryDb);
        prisma = module.get(PrismaService);
        await prisma.$connect();
    });

    afterAll(async () => {
        await cleanDb();
    });

    it('creates and retrieves a user record', async () => {
        const baseDate = new Date('2024-01-01T00:00:00.000Z');
        const user = new UserEntity({
            username: 'testuser',
            discordId: 'discord123',
            googleEmail: 'user@example.com',
            passportWalletAddress: 'walletaddr',
            password: 'secret',
            perksWalletAddress: 'wallet',
            isPremium: false,
            totalQuestCompleted: 0,
            totalTravelDistance: 0,
            role: 'USER',
            registeredAt: baseDate,
            discordJoinedAt: baseDate,
            isBanned: false,
            delFlag: false,
            insUserId: 'system',
            insDateTime: baseDate,
            updUserId: 'system',
            updDateTime: baseDate,
        });

        const created = await repository.createUser(user);
        expect(created.userId).toBeDefined();

        const found = await repository.getUserInfoByUserId(created.userId ?? '');
        expect(found?.username).toEqual('testuser');

        const byUsername = await repository.getUserByUsername('testuser');
        expect(byUsername?.userId).toEqual(created.userId);

        const byWallet = await repository.getUserByPassportWallet('walletaddr');
        expect(byWallet?.userId).toEqual(created.userId);

        const byDiscord = await repository.getUserByDiscordId('discord123');
        expect(byDiscord?.userId).toEqual(created.userId);

        const byGoogle = await repository.getUserByGoogleEmail('user@example.com');
        expect(byGoogle?.userId).toEqual(created.userId);
    });
});
