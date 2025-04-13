# WebSocket vs REST API in Tourii Architecture

## 1. Overview
Tourii's platform blends social, gamified, and real-world travel experiences. While REST APIs provide fast, reliable data exchange, WebSockets enable real-time collaboration and interaction.

## 2. REST API — Pull-Based Communication
### Characteristics:
- Request/Response model
- Uses HTTP(S)
- Stateless
- Good for CRUD operations

### Tourii Use Cases:
- Fetch quests on login: `GET /api/quests`
- Submit quest check-in: `POST /api/quests/check-in`
- Mint NFTs or Digital Passport

### Pros:
- Simpler to cache
- Easy to debug and monitor
- Works well for one-time data pulls

## 3. WebSocket — Push-Based Communication
### Characteristics:
- Persistent, bidirectional connection
- Uses `ws://` or `wss://`
- Server can push data anytime

### Tourii Use Cases:
- Show real-time check-ins ("Alice just checked in")
- Push live quest progress across group members
- Memory Wall: live likes/comments
- Live map updates

### Pros:
- Instant user feedback
- Enables multiplayer-like collaboration
- Reduces polling overhead

## 4. When REST Alone is Enough
- Data doesn’t change often
- No social sync needed
- Actions don’t need to reflect instantly across users

## 5. When You Need WebSocket
- Social, collaborative, or multiplayer interactions
- Real-time feedback improves UX (e.g., live check-ins)
- Interactive features (e.g., Memory Wall updates, quest unlocks)

## 6. Folder Structure (NestJS Backend)
```
src/
├── quests/
│   ├── quests.controller.ts      // REST: /api/quests
│   ├── quests.gateway.ts         // WebSocket: 'check-in', etc.
│   ├── quests.service.ts         // Shared logic
│   ├── dtos/
│   │   └── check-in.dto.ts
│   └── quests.module.ts
```

## 7. REST Controller Example
```ts
@Controller('api/quests')
export class QuestsController {
  @Post('check-in')
  checkIn(@Body() dto: CheckInDto) {
    return this.questsService.checkIn(dto);
  }
}
```

## 8. WebSocket Gateway Example
```ts
@WebSocketGateway({
  namespace: '/realtime/quests',
  cors: { origin: '*' }
})
export class QuestsGateway {
  @SubscribeMessage('check-in')
  async handleCheckIn(@MessageBody() dto: CheckInDto) {
    const result = await this.questsService.checkIn(dto);
    this.server.emit('new-check-in', result);
  }
}
```

## 9. Next.js Client Socket
```ts
const socket = io('http://localhost:3001/realtime/quests');
socket.emit('check-in', { userId, locationId });
socket.on('new-check-in', (data) => console.log('Checked in:', data));
```

## 10. Recommendation
Start with REST for core functionality. Add WebSocket for:
- Check-in broadcasting
- Group quest sync
- Real-time Memory Wall

This hybrid approach balances performance, simplicity, and user experience.

