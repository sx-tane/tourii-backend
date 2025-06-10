import type { UserEntity } from '@app/core/domain/user/user.entity';
import { UserProfileResponseDto } from '@app/tourii-backend/controller/model/tourii-response/user-profile-response.model';

export class UserProfileResultBuilder {
    static userInfoToDto(userInfo: UserEntity['userInfo']) {
        return {
            passportType: userInfo?.userDigitalPassportType ?? '',
            level: userInfo?.level ?? '',
        };
    }

    static userToDto(user: UserEntity): UserProfileResponseDto {
        return {
            userId: user.userId ?? '',
            username: user.username,
            ...UserProfileResultBuilder.userInfoToDto(user.userInfo),
            title: user.isBanned ? 'Banned' : 'Active',
        };
    }
}
