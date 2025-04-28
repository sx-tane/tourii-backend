# 🔗 Backend–Frontend Integration Guide

This document outlines the key integration points between the **Tourii backend** and **frontend**, including API endpoint mappings, versioning, WebSocket usage, and real-time feature syncing.
---

## 🌐 API Design & Versioning

```ts
export const API_VERSIONS = {
  V1: '1.0',
  V2: '2.0'
} as const;

export type ApiVersion = typeof API_VERSIONS[keyof typeof API_VERSIONS];
```

### Request Headers
```ts
{
  'Content-Type': 'application/json',
  'x-api-key': '<key>',
  'x-api-version': '1.0',
}
```

---

## 🩹 Domain-Based API Integration (Per API Entry)

We now break down **each API** inside its domain with:
- Short description
- Frontend component
- API endpoints
  - Basic logic: Controller → Service → Repo/External

👉 All frontend links are cross-referenced from `BACKEND_FRONTEND_INTEGRATION.md`.

---

### 1 AUTHENTICATION
- **Short description**: Handles registration, login, token refresh, social auth, and wallet signature verification.
- **API**:
  - `POST /auth/login`: traditional login → `AuthController.login()` → `AuthService.validate()`
  - `POST /auth/register`: user signup → `AuthController.register()` → `UserService.createUser()`
  - `GET /auth/nonce`: get nonce for wallet signature → `AuthController.getNonce()` → `AuthService.generateNonce()`
  - `POST /auth/verify-signature`: wallet login → `AuthController.verifySignature()` → `Web3Service.verifyAndLogin()`
  - `POST /auth/social/:provider`: OAuth login → `AuthController.socialLogin()` → `OAuthService.validateToken()`

### 2 USER
- **Short description**: Fetches and updates the user profile and linked wallets.
- **API**:
  - `GET /users/me`: fetch profile → `UserController.me()` → `UserService.getById()`
  - `PUT /users/me`: update profile → `UserController.update()` → `UserService.updateProfile()`
  - `GET /users/me/wallet`: get wallet → `UserController.wallet()` → `UserService.getWallet()`

### 3 STORIES
- **Short description**: Saga and chapter-based interactive travel stories.
- **API**:
  - [x] `POST /stories/create-saga`: create saga → `StoryController.createStory()`
  - [x] `GET /stories/sagas`: list sagas → `StoryController.getSagas()`
  - [x] `GET /stories/sagas/:storyId/chapters`: saga chapters → `StoryController.getStoryChapters()`
  - [ ] `POST /stories/chapters/:chapterId/progress`: save reading progress → `ChapterController.markProgress()` → `UserStoryLogService.track()`

### 4 ROUTES
- **Short description**: Explore tourist routes and regional info.
- **Interface**:
  ```ts
  interface ModelRoute {
    id: string;
    routeName: string;
    touristSpots: string[];
  }
  ```
- **API**:
  - `GET /routes`: list all routes → `RouteController.findAll()`
  - `GET /routes/:id`: route detail → `RouteController.findOne()`
  - `GET /routes/:id/spots`: route spots → `RouteController.getSpots()`
  - `GET /routes/:id/recommendations`: food/culture recs → `RouteController.getRecommendations()`

### 5 QUESTS
- **Short description**: Interactive gamified task system.
- **API**:
  - `GET /quests`: fetch all quests → `QuestController.index()`
  - `POST /quests/:id/start`: start quest → `QuestController.start()`
  - `GET /quests/:id/tasks`: list tasks → `TaskController.list()`
  - `POST /quests/tasks/:id/submit`: submit task answer → `TaskController.submit()`
  - `POST /quests/:id/complete`: complete quest → `QuestController.complete()`

### 6 DIGITAL PASSPORT
- **Short description**: Web3 NFT identity & collectible stamps.
- **API**:
  - `GET /assets/passport`: current NFT → `PassportController.find()`
  - `POST /assets/passport/mint`: auto mint on user creation → `PassportController.mint()` → `PassportService.mintTo()`
  - `GET /assets/stamps`: collected stamps → `PassportController.getStamps()`
  - 🔄 Auto-mint flow:
    - `AccountService.createUser()` ➔ emits NFT mint (passport + log)
    - Calls NFT SDK ➔ mint contract
    - Saved via `UserOnchainItemService`
    - Triggers `nft:minted` WebSocket

### 7 CHECK-IN
- **Short description**: QR or GPS-based visit validation.
- **API**:
  - `POST /check-in/location`: perform check-in → `CheckInController.checkIn()`
  - `GET /check-in/map`: display check-in data on map

### 8 PERKS & REWARDS
- **Short description**: NFT rewards and point-based redemptions.
- **API**:
  - `GET /assets/perks`: owned perks → `PerkController.myPerks()`
  - `POST /assets/perks/:id/redeem`: redeem → `PerkController.redeem()`

### 9 MEMORY WALL
- **Short description**: Log-like feed extracted from existing travel, quest, and story logs. No need for dedicated model at MVP.
- **API**:
  - `GET /memory-wall/feed`: pseudo-feed → `MemoryWallController.getFeed()`
    - JOIN data from `user_travel_log`, `user_quest_log`, `user_story_log`
    - Filter by timestamp
    - Map to a common response format
  - 🔍 **Future**: Like, comment, and reply system can extend this structure

- **Note**: no need for a new model right now. Memory wall = `SELECT` + `UNION` across logs.
  - You **can** optionally create a view:
    ```sql
      CREATE VIEW memory_feed AS
      SELECT
        utl.user_id,
        'TRAVEL' AS type,
        utl.tourist_spot_id AS related_id,
        utl.travel_distance,
        utl.ins_date_time AS created_at,
        ts.image_set->>'main' AS image_url,
        ts.tourist_spot_name AS content
      FROM user_travel_log utl
      JOIN tourist_spot ts ON utl.tourist_spot_id = ts.tourist_spot_id

      UNION

      SELECT
        uql.user_id,
        'QUEST',
        uql.quest_id,
        NULL,
        uql.completed_at,
        ts.image_set->>'main',
        q.quest_name
      FROM user_quest_log uql
      JOIN quest q ON uql.quest_id = q.quest_id
      JOIN tourist_spot ts ON q.tourist_spot_id = ts.tourist_spot_id
      WHERE uql.status = 'COMPLETED'

      UNION

      SELECT
        usl.user_id,
        'STORY',
        usl.story_id,
        NULL,
        usl.finished_at,
        ts.image_set->>'main',
        s.story_title
      FROM user_story_log usl
      JOIN story s ON usl.story_id = s.story_id
      JOIN tourist_spot ts ON s.tourist_spot_id = ts.tourist_spot_id
      WHERE usl.status = 'COMPLETED';
    ```

### 10 LOGS
- **Short description**: View travel, quest, story logs for profile & achievements.
- **API**:
  - `GET /logs/travel`: travel history → `LogController.travel()`
  - `GET /logs/quests`: quest log → `LogController.quests()`
  - `GET /logs/stories`: story progress → `LogController.stories()`

### 11 ADMIN
- **Short description**: Admin-level content control (CRUD).
- **API**:
  - `GET /admin/quests`: list → `AdminQuestController.list()`
  - `POST /admin/quests`: create → `AdminQuestController.create()`
  - `PUT /admin/quests/:id`: update → `AdminQuestController.update()`

---

## 🔄 WebSocket Events

```ts
const WS_EVENTS = {
  QUEST_STARTED: 'quest:started',
  QUEST_COMPLETED: 'quest:completed',
  TASK_COMPLETED: 'task:completed',
  MEMORY_NEW: 'memory:new',
  COMMENT_NEW: 'comment:new',
  LIKE_NEW: 'like:new',
  NFT_MINTED: 'nft:minted',
  PERK_REDEEMED: 'perk:redeemed',
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked'
};
```

### WebSocket Usage

**Backend (NestJS)**:
- Gateway created via `@WebSocketGateway()`
- Emit via `this.server.emit('quest:completed', payload)` in service
- Auth done with token in handshake

**Frontend (React)**:
```ts
const socket = new WebSocket('wss://api.tourii.xyz/tourii-backend/ws');
socket.onmessage = (msg) => {
  const event = JSON.parse(msg.data);
  handleEvent(event);
};
```

---

## 🩺 Testing & Validation

- Jest for integration test
- Swagger auto-docs for endpoint reference
- Version downgrade returns 410 error
- Custom error schema with `statusCode`, `message`, `apiKey.valid`

---

_Last Updated: 24/04/2025_