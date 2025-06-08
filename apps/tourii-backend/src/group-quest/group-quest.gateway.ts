import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/group-quest', cors: { origin: '*' } })
export class GroupQuestGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinGroup')
    handleJoin(@ConnectedSocket() socket: Socket, @MessageBody() data: { questId: string }) {
        socket.join(`group_${data.questId}`);
    }

    @SubscribeMessage('ready')
    handleReady(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: { questId: string; userId: string },
    ) {
        this.server.to(`group_${data.questId}`).emit('memberReady', { userId: data.userId });
    }

    broadcastQuestStarted(questId: string) {
        this.server.to(`group_${questId}`).emit('questStarted');
    }
}
