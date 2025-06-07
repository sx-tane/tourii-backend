import { Test, type TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/core/provider/prisma.service';
import { UserRepositoryDb } from './user-repository-db';
import { UserEntity } from '@app/core/domain/user/user.entity';

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
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it('creates and retrieves a user record', async () => {
        const baseDate = new Date('2024-01-01T00:00:00.000Z');
        const user = new UserEntity(
            {
                username: 'testuser',
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
            },
            'test-user-id',
        );

        const created = await repository.createUser(user);
        expect(created.userId).toEqual('test-user-id');

        const found = await repository.getUserInfoByUserId('test-user-id');
        expect(found?.username).toEqual('testuser');
    });
});
