import { getEnv } from '@app/core/utils/env-utils';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    namespace: '/group-quest',
    cors: {
        origin:
            getEnv({ key: 'NODE_ENV', defaultValue: 'dev' }) === 'production'
                ? ['https://tourii.xyz', 'https://*.tourii.xyz']
                : '*',
        credentials: true,
    },
})
export class GroupQuestGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinGroup')
    handleJoin(@ConnectedSocket() socket: Socket, @MessageBody() data: { questId: string }) {
        // Validate questId before joining
        if (!data?.questId || typeof data.questId !== 'string') {
            socket.emit('error', { message: 'Invalid quest ID' });
            return;
        }

        socket.join(`group_${data.questId}`);
        socket.emit('joinedGroup', { questId: data.questId });
    }

    @SubscribeMessage('ready')
    handleReady(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: { questId: string; userId: string },
    ) {
        // Validate input data
        if (
            !data?.questId ||
            !data?.userId ||
            typeof data.questId !== 'string' ||
            typeof data.userId !== 'string'
        ) {
            socket.emit('error', { message: 'Invalid quest ID or user ID' });
            return;
        }

        this.server.to(`group_${data.questId}`).emit('memberReady', { userId: data.userId });
    }

    broadcastQuestStarted(questId: string) {
        if (!questId || typeof questId !== 'string') {
            return;
        }

        this.server.to(`group_${questId}`).emit('questStarted');
    }
}
