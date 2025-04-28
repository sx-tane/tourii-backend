# 📚 Tourii Group Quest - Final REST + WebSocket Architecture & Code Spec

---

## 1. Overview

Tourii uses a **hybrid architecture** combining:
- **REST API**: for data persistence (quests, check-ins)
- **WebSocket**: for real-time group collaboration (waiting room, check-ins)

---

## 2. Communication Design

| Layer | Technology | Purpose |
|:--|:--|:--|
| Data Save | REST API | Stable writes to PostgreSQL |
| Real-Time Notification | WebSocket (Socket.IO) | Push updates instantly |
| Authentication | JWT | Required for both REST and WebSocket |

---

## 3. Database Structure

Use your existing tables:
| Purpose | Table |
|:--|:--|
| Group quest participation | `user_quest_log` |
| Player check-in tracking | `user_travel_log` |
| Quest/task data | `quest`, `quest_task` |
| User info | `user` |

No new table needed.

---

## 4. Backend Folder Structure (NestJS)

```
src/
├── quests/
│   ├── quests.controller.ts
│   ├── quests.gateway.ts
│   ├── quests.service.ts
│   ├── quests.module.ts
│   ├── dtos/
│   │   ├── check-in.dto.ts
│   │   └── join-quest.dto.ts
│   ├── repositories/
│   │   └── quests.repository.ts
```

---

## 5. API Specification (Swagger)

### 5.1 Join Quest API

**POST** `/api/quests/{id}/join`

- Request:

```json
{
  "userId": "USER_ID"
}
```

- Response:

```json
{
  "questId": "QUEST_ID",
  "userId": "USER_ID"
}
```

---

### 5.2 Check-In API

**POST** `/api/quests/{id}/check-in`

- Request:

```json
{
  "userId": "USER_ID",
  "locationId": "LOCATION_ID"
}
```

- Response:

```json
{
  "userId": "USER_ID",
  "questId": "QUEST_ID",
  "locationId": "LOCATION_ID",
  "timestamp": "ISO_TIMESTAMP"
}
```

---

## 6. WebSocket Events

**Namespace**: `/realtime/quests`

### Client Can Emit:

| Event | Payload |
|:--|:--|
| `joinQuestRoom` | `{ questId: string }` |
| `checkIn` | `{ questId: string, locationId: string }` |

### Server Emits:

| Event | Payload |
|:--|:--|
| `playerJoined` | `{ userId: string, questId: string }` |
| `newCheckIn` | `{ userId: string, questId: string, locationId: string, timestamp: string }` |

---

## 7. JWT Authentication (Socket + REST)

- REST: Bearer Token in Authorization header
- WebSocket: Pass token during socket connect:

```javascript
const socket = io('https://tourii.xyz/realtime/quests', {
  auth: { token: YOUR_JWT_TOKEN }
});
```

Backend verifies token on WebSocket `handleConnection()`.

---

## 8. System Architecture Diagram (Simple)

```
Frontend (Next.js)
    ↓ (REST POST /quests/:id/join, /check-in)
Backend (NestJS REST Controller)
    ↓
Prisma DB (user_quest_log, user_travel_log)

Parallel:

Frontend (Next.js WebSocket)
    ↔ (Events: joinQuestRoom, playerJoined, newCheckIn)
Backend (NestJS Gateway)
    ↔ (broadcast to room)
```

---

# 🛠 Backend Code (NestJS)

---

### quests.controller.ts

```typescript
@Controller('api/quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Post(':id/join')
  async joinQuest(@Param('id') questId: string, @Body() body: { userId: string }) {
    return this.questsService.joinQuest(body.userId, questId);
  }

  @Post(':id/check-in')
  async checkIn(@Param('id') questId: string, @Body() body: { userId: string; locationId: string }) {
    return this.questsService.checkIn({
      userId: body.userId,
      questId,
      locationId: body.locationId,
    });
  }
}
```

---

### quests.gateway.ts

```typescript
@WebSocketGateway({
  namespace: '/realtime/quests',
  cors: { origin: '*' }
})
export class QuestsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly questsService: QuestsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth?.token;
    if (!token) return socket.disconnect();
    try {
      const payload = await this.jwtService.verifyAsync(token);
      socket.data.user = { id: payload.sub };
    } catch {
      socket.disconnect();
    }
  }

  @SubscribeMessage('joinQuestRoom')
  async joinQuestRoom(@ConnectedSocket() socket: Socket, @MessageBody() data: { questId: string }) {
    socket.join(`quest_${data.questId}`);
  }

  broadcastPlayerJoined(questId: string, playerData: any) {
    this.server.to(`quest_${questId}`).emit('playerJoined', playerData);
  }

  broadcastNewCheckIn(questId: string, checkInData: any) {
    this.server.to(`quest_${questId}`).emit('newCheckIn', checkInData);
  }
}
```

---

### quests.service.ts

```typescript
@Injectable()
export class QuestsService {
  constructor(
    private readonly questsGateway: QuestsGateway,
    private readonly questsRepository: QuestsRepository,
  ) {}

  async joinQuest(userId: string, questId: string) {
    await this.questsRepository.createUserQuestLog(userId, questId);
    const playerInfo = { userId, questId };
    this.questsGateway.broadcastPlayerJoined(questId, playerInfo);
    return playerInfo;
  }

  async checkIn(data: { userId: string; questId: string; locationId: string }) {
    await this.questsRepository.saveCheckIn(data);
    const checkInInfo = { ...data, timestamp: new Date() };
    this.questsGateway.broadcastNewCheckIn(data.questId, checkInInfo);
    return checkInInfo;
  }
}
```

---

### quests.repository.ts

```typescript
@Injectable()
export class QuestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUserQuestLog(userId: string, questId: string) {
    return this.prisma.user_quest_log.create({
      data: {
        user_id: userId,
        quest_id: questId,
        status: 'ONGOING',
      },
    });
  }

  async saveCheckIn(data: { userId: string; questId: string; locationId: string }) {
    return this.prisma.user_travel_log.create({
      data: {
        user_id: data.userId,
        quest_id: data.questId,
        task_id: data.locationId,
        tourist_spot_id: data.locationId,
        user_longitude: 0,
        user_latitude: 0,
      },
    });
  }
}
```

---

# 🔥 Frontend Code (Next.js)

---

### useQuestSocket.ts

```typescript
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

export const useQuestSocket = (questId: string, token: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [checkIns, setCheckIns] = useState<any[]>([]);

  useEffect(() => {
    const s = io('https://tourii.xyz/realtime/quests', { auth: { token } });

    s.emit('joinQuestRoom', { questId });

    s.on('playerJoined', (data) => setMembers((prev) => [...prev, data]));
    s.on('newCheckIn', (data) => setCheckIns((prev) => [...prev, data]));

    setSocket(s);
    return () => s.disconnect();
  }, [questId, token]);

  const sendCheckIn = (locationId: string) => {
    if (socket) {
      socket.emit('checkIn', { questId, locationId });
    }
  };

  return { members, checkIns, sendCheckIn };
};
```