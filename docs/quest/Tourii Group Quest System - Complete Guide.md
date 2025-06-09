# 🎮 Tourii Group Quest System - Complete Guide

This document provides a comprehensive overview of the Tourii Group Quest system, combining HTTP APIs and real-time WebSocket communication for collaborative quest experiences.

---

## 📋 Table of Contents

1. [System Overview](#-system-overview)
2. [Architecture](#-architecture)
3. [Data Flow & User Journey](#-data-flow--user-journey)
4. [Database Structure](#-database-structure)
5. [API Endpoints](#-api-endpoints)
6. [WebSocket Events](#-websocket-events)
7. [Implementation Examples](#-implementation-examples)
8. [Technical Details](#-technical-details)

---

## 🌟 System Overview

The Tourii Group Quest system enables **real-time collaborative quests** where multiple users can:

- **Join group quests** together
- **Coordinate in real-time** using WebSocket
- **Track progress** individually and as a group
- **Complete tasks** with live updates
- **Receive instant notifications** when team members are ready or complete actions

### Key Features

| Feature                      | Technology            | Purpose                               |
| ---------------------------- | --------------------- | ------------------------------------- |
| 🏆 **Quest Management**       | HTTP REST API         | Create, join, and manage quests       |
| ⚡ **Real-time Coordination** | WebSocket (Socket.IO) | Live member status and notifications  |
| 👥 **Group Formation**        | JSON Storage + API    | Dynamic group creation and management |
| 📍 **Location Check-ins**     | GPS + API             | Track physical quest progress         |
| 🔐 **Authentication**         | JWT                   | Secure both REST and WebSocket        |

---

## 🏗️ Architecture

### Hybrid Communication Model

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   Database      │
│   (Next.js)     │    │   (NestJS)       │    │   (PostgreSQL)  │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│                 │    │                  │    │                 │
│ HTTP Requests   │───▶│ REST Controllers │───▶│ Data Storage    │
│ (Create/Join)   │    │ (Quest CRUD)     │    │ (Persistent)    │
│                 │    │                  │    │                 │
│ WebSocket       │◄──▶│ Socket Gateway   │    │                 │
│ (Real-time)     │    │ (Live Updates)   │    │                 │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### When to Use Each Technology

| **HTTP REST API**      | **WebSocket**                 |
| ---------------------- | ----------------------------- |
| ✅ Join/Leave quest     | ✅ "Ready" status updates      |
| ✅ Submit quest results | ✅ Live member notifications   |
| ✅ Fetch quest data     | ✅ Real-time chat/coordination |
| ✅ User authentication  | ✅ Quest start signals         |
| ✅ Progress persistence | ✅ Live location sharing       |

---

## 🔄 Data Flow & User Journey

### Complete Flow: Alice & Bob Join a Quest

#### **Phase 1: Quest Setup (HTTP API)**

```typescript
// 1. Alice joins via API
POST /api/quests/tokyo-adventure/join
Headers: { Authorization: "Bearer alice-jwt" }
Body: { userId: "alice123" }

Response: {
  questId: "tokyo-adventure",
  members: [
    { userId: "alice123", username: "Alice", ready: false }
  ],
  status: "waiting_for_members"
}
```

#### **Phase 2: Real-time Connection (WebSocket)**

```typescript
// 2. Alice connects to WebSocket
const socket = io('/group-quest', {
  auth: { token: 'alice-jwt' }
});

// 3. Join quest room for live updates
socket.emit('joinGroup', { questId: 'tokyo-adventure' });

socket.on('joinedGroup', () => {
  console.log('Connected to quest room!');
  showWaitingRoom(); // Show UI
});
```

#### **Phase 3: Bob Joins**

```typescript
// 4. Bob joins via API (same as Alice)
POST /api/quests/tokyo-adventure/join
Body: { userId: "bob456" }

// 5. Bob connects to WebSocket
socket.emit('joinGroup', { questId: 'tokyo-adventure' });

// 6. Alice receives notification that Bob joined
socket.on('memberJoined', (data) => {
  console.log(`${data.username} joined the quest!`);
});
```

#### **Phase 4: Ready Coordination (WebSocket Only)**

```typescript
// 7. Alice clicks "Ready" - WebSocket only
socket.emit('ready', { 
  questId: 'tokyo-adventure', 
  userId: 'alice123' 
});

// 8. Bob sees Alice is ready
socket.on('memberReady', (data) => {
  if (data.userId === 'alice123') {
    showUserReady('Alice'); // "Alice is ready!"
  }
});

// 9. Bob also becomes ready
socket.emit('ready', { 
  questId: 'tokyo-adventure', 
  userId: 'bob456' 
});
```

#### **Phase 5: Quest Start (Backend Triggered)**

```typescript
// 10. Backend detects all members ready
// In QuestService.ts
async handleAllMembersReady(questId: string) {
  // Update database
  await this.questService.startQuest(questId);
  
  // Notify via WebSocket
  this.groupQuestGateway.broadcastQuestStarted(questId);
}

// 11. All users receive start signal
socket.on('questStarted', () => {
  startQuestExperience(); // Begin the quest!
});
```

---

## 💾 Database Structure

### Core Tables

| Table             | Purpose                     | Key Fields                               |
| ----------------- | --------------------------- | ---------------------------------------- |
| `user_quest_log`  | Group membership & progress | `group_activity_members` (JSON)          |
| `user_travel_log` | Location check-ins          | `user_id`, `quest_id`, `tourist_spot_id` |
| `quest`           | Quest definitions           | `quest_id`, `quest_name`, `quest_type`   |
| `quest_task`      | Individual tasks            | `task_id`, `quest_id`, `task_type`       |

### Group Data Structure (JSON)

Stored in `user_quest_log.group_activity_members`:

```json
[
  {
    "user_id": "alice123",
    "discord_id": "789123456",
    "group_name": "Tokyo Explorers",
    "joined_at": "2024-03-20T10:00:00Z",
    "role": "leader",
    "ready": false
  },
  {
    "user_id": "bob456",
    "discord_id": "789123457",
    "group_name": "Tokyo Explorers",
    "joined_at": "2024-03-20T10:05:00Z",
    "role": "member",
    "ready": false
  }
]
```

---

## 🚀 API Endpoints

### Quest Management

| Endpoint                       | Method | Purpose           | Auth Required |
| ------------------------------ | ------ | ----------------- | ------------- |
| `/api/quests/:questId/join`    | POST   | Join a quest      | ✅             |
| `/api/quests/:questId/leave`   | POST   | Leave a quest     | ✅             |
| `/api/quests/:questId/members` | GET    | Get group members | ✅             |
| `/api/quests/:questId/start`   | POST   | Start group quest | ✅ (Leader)    |

### Task & Progress

| Endpoint                                    | Method | Purpose                | Auth Required |
| ------------------------------------------- | ------ | ---------------------- | ------------- |
| `/api/quests/:questId/tasks`                | GET    | Get quest tasks        | ✅             |
| `/api/quests/:questId/tasks/:taskId/submit` | POST   | Submit task completion | ✅             |
| `/api/quests/:questId/check-in`             | POST   | Location check-in      | ✅             |
| `/api/quests/:questId/progress`             | GET    | Get group progress     | ✅             |

### Example API Usage

```typescript
// Join Quest
const joinResponse = await fetch('/api/quests/tokyo-adventure/join', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + userToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 'alice123'
  })
});

// Check-in at location
const checkinResponse = await fetch('/api/quests/tokyo-adventure/check-in', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + userToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 'alice123',
    locationId: 'shibuya-crossing',
    latitude: 35.6595,
    longitude: 139.7006
  })
});
```

---

## ⚡ WebSocket Events

### Gateway Configuration

```typescript
@WebSocketGateway({
    namespace: '/group-quest',
    cors: {
        origin: getEnv({ key: 'NODE_ENV', defaultValue: 'dev' }) === 'production'
            ? ['https://tourii.xyz', 'https://*.tourii.xyz']
            : '*',
        credentials: true,
    },
})
```

### Client → Server Events

| Event        | Payload                               | Purpose                          |
| ------------ | ------------------------------------- | -------------------------------- |
| `joinGroup`  | `{ questId: string }`                 | Join quest room for live updates |
| `ready`      | `{ questId: string, userId: string }` | Mark user as ready               |
| `leaveGroup` | `{ questId: string }`                 | Leave quest room                 |

### Server → Client Events

| Event          | Payload                                | Purpose                   |
| -------------- | -------------------------------------- | ------------------------- |
| `joinedGroup`  | `{ questId: string }`                  | Confirmation of room join |
| `memberReady`  | `{ userId: string }`                   | Someone marked ready      |
| `memberJoined` | `{ userId: string, username: string }` | New member joined         |
| `questStarted` | `{}`                                   | Quest has begun           |
| `error`        | `{ message: string }`                  | Error notification        |

### Frontend WebSocket Implementation

```typescript
// Hook for Quest WebSocket
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useQuestSocket = (questId: string, userToken: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [readyMembers, setReadyMembers] = useState<Set<string>>(new Set());
  const [questStarted, setQuestStarted] = useState(false);

  useEffect(() => {
    const newSocket = io('/group-quest', {
      auth: { token: userToken }
    });

    // Join quest room
    newSocket.emit('joinGroup', { questId });

    // Listen for events
    newSocket.on('joinedGroup', (data) => {
      console.log('Joined quest room:', data.questId);
    });

    newSocket.on('memberJoined', (data) => {
      setMembers(prev => [...prev, data]);
    });

    newSocket.on('memberReady', (data) => {
      setReadyMembers(prev => new Set([...prev, data.userId]));
    });

    newSocket.on('questStarted', () => {
      setQuestStarted(true);
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [questId, userToken]);

  const markReady = () => {
    if (socket) {
      socket.emit('ready', { questId, userId: 'current-user-id' });
    }
  };

  return {
    socket,
    members,
    readyMembers,
    questStarted,
    markReady
  };
};
```

---

## 🛠️ Implementation Examples

### Backend: Quest Controller

```typescript
@Controller('api/quests')
export class QuestController {
  constructor(
    private readonly questService: QuestService,
    private readonly groupQuestGateway: GroupQuestGateway
  ) {}

  @Post(':questId/join')
  async joinQuest(
    @Param('questId') questId: string,
    @Body() body: { userId: string },
    @Headers('authorization') auth: string
  ) {
    // 1. Validate and join quest
    const quest = await this.questService.joinQuest(questId, body.userId);
    
    // 2. WebSocket will handle real-time notifications
    // (User will connect separately via WebSocket)
    
    return {
      success: true,
      questId: quest.questId,
      members: quest.members
    };
  }

  @Post(':questId/ready')
  async markReady(
    @Param('questId') questId: string,
    @Body() body: { userId: string }
  ) {
    // 1. Update database
    await this.questService.markUserReady(questId, body.userId);
    
    // 2. Check if all members are ready
    const allReady = await this.questService.checkAllMembersReady(questId);
    
    if (allReady) {
      // 3. Start quest and notify via WebSocket
      await this.questService.startQuest(questId);
      this.groupQuestGateway.broadcastQuestStarted(questId);
    }
    
    return { success: true };
  }
}
```

### Backend: WebSocket Gateway

```typescript
@WebSocketGateway({
    namespace: '/group-quest',
    cors: { /* ... */ }
})
export class GroupQuestGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinGroup')
    handleJoin(@ConnectedSocket() socket: Socket, @MessageBody() data: { questId: string }) {
        // Validate questId
        if (!data?.questId || typeof data.questId !== 'string') {
            socket.emit('error', { message: 'Invalid quest ID' });
            return;
        }

        // Join room
        socket.join(`group_${data.questId}`);
        socket.emit('joinedGroup', { questId: data.questId });
    }

    @SubscribeMessage('ready')
    handleReady(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: { questId: string; userId: string }
    ) {
        // Validate input
        if (!data?.questId || !data?.userId) {
            socket.emit('error', { message: 'Invalid quest ID or user ID' });
            return;
        }

        // Broadcast to all members in the quest
        this.server.to(`group_${data.questId}`).emit('memberReady', { 
            userId: data.userId 
        });
    }

    // Called by service when quest should start
    broadcastQuestStarted(questId: string) {
        this.server.to(`group_${questId}`).emit('questStarted');
    }
}
```

### Frontend: Quest Room Component

```typescript
import React from 'react';
import { useQuestSocket } from './hooks/useQuestSocket';

interface QuestRoomProps {
  questId: string;
  userToken: string;
  currentUserId: string;
}

export const QuestRoom: React.FC<QuestRoomProps> = ({
  questId,
  userToken,
  currentUserId
}) => {
  const { members, readyMembers, questStarted, markReady } = useQuestSocket(questId, userToken);

  if (questStarted) {
    return <QuestExperience questId={questId} />;
  }

  return (
    <div className="quest-waiting-room">
      <h2>Waiting Room - Quest: {questId}</h2>
      
      <div className="members-list">
        <h3>Team Members:</h3>
        {members.map(member => (
          <div key={member.userId} className="member-item">
            <span>{member.username}</span>
            {readyMembers.has(member.userId) && <span className="ready-badge">✅ Ready</span>}
          </div>
        ))}
      </div>

      <button 
        onClick={markReady}
        disabled={readyMembers.has(currentUserId)}
        className="ready-button"
      >
        {readyMembers.has(currentUserId) ? 'Ready ✅' : 'Mark Ready'}
      </button>

      <div className="status">
        {readyMembers.size} / {members.length} members ready
      </div>
    </div>
  );
};
```

---

## 🔧 Technical Details

### Authentication Flow

1. **JWT Token**: Generated on login, used for both REST and WebSocket
2. **REST**: Bearer token in Authorization header
3. **WebSocket**: Token passed in connection auth object

```typescript
// WebSocket authentication
const socket = io('/group-quest', {
  auth: { token: userJwtToken }
});

// REST authentication
fetch('/api/quests/123/join', {
  headers: {
    'Authorization': `Bearer ${userJwtToken}`
  }
});
```

### Error Handling

```typescript
// WebSocket error handling
socket.on('error', (error) => {
  switch (error.code) {
    case 'INVALID_QUEST_ID':
      showErrorMessage('Quest not found');
      break;
    case 'ALREADY_IN_QUEST':
      showErrorMessage('You are already in this quest');
      break;
    default:
      showErrorMessage(error.message);
  }
});

// REST error handling
try {
  const response = await fetch('/api/quests/123/join', options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('Quest join failed:', error);
}
```

### Performance Considerations

1. **Room Management**: Each quest gets its own Socket.IO room
2. **Event Throttling**: Limit rapid-fire events to prevent spam
3. **Connection Cleanup**: Proper disconnection handling
4. **Database Indexing**: Index `group_activity_members` JSON field

### Security Measures

1. **Input Validation**: Validate all WebSocket message payloads
2. **Rate Limiting**: Prevent WebSocket event flooding
3. **JWT Verification**: Authenticate all connections
4. **CORS Configuration**: Environment-specific origin restrictions

---

## 🎯 Summary

The Tourii Group Quest system provides a **hybrid architecture** that combines:

- **📡 REST APIs** for reliable data persistence and CRUD operations
- **⚡ WebSocket** for real-time collaboration and live updates
- **🔐 JWT Authentication** across both communication channels
- **🎮 Room-based coordination** for isolated group experiences

This architecture ensures both **reliability** (via HTTP) and **real-time experience** (via WebSocket), giving users a seamless collaborative quest experience! 🚀

---

*For technical support or questions about implementation, refer to the individual code files in the `/src/group-quest/` directory or consult the API documentation.* 