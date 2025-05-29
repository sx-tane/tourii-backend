# Group Activities Management Guide

## 📝 Data Structure Overview

### Core Storage

| **Field**                     | **Table**      | **Purpose**                                                                   |
| ----------------------------- | -------------- | ----------------------------------------------------------------------------- |
| group_activity_members (JSON) | user_quest_log | Stores group membership data including user IDs, Discord IDs, and group names |

### JSON Structure Example

```json
[
  {
    "user_id": "USER001",
    "discord_id": "123456",
    "group_name": "Team Alpha",
    "joined_at": "2024-03-20T10:00:00Z",
    "role": "leader"
  },
  {
    "user_id": "USER002",
    "discord_id": "123457",
    "group_name": "Team Alpha",
    "joined_at": "2024-03-20T10:05:00Z",
    "role": "member"
  }
]
```

## 🔄 Group Quest Workflow

### 1. Group Formation Phase

- User either creates a new group or joins an existing one
- Group information is stored in `user_quest_log.group_activity_members`
- System validates group size requirements
- Group leader can set group preferences/settings

### 2. Quest Progress Tracking

- Individual Progress:
  - Each member completes assigned tasks
  - Progress tracked in user_quest_log (standard task status)
  - Submission proof stored in submission_data field
- Group Progress:
  - Backend validates task type (quest_task.task_type = GROUP_ACTIVITY)
  - Tracks completion status for all members
  - Updates group milestone achievements

### 3. Final Check-In Process

- System Requirements:
  - All group members must complete their tasks
  - Group leader initiates final check-in
  - Validation of group completion criteria
- Success Actions:
  - Group progresses to final checkpoint
  - Rewards distribution (if applicable)
  - Group status update

## 🛠 API Endpoints

| **Endpoint**                                  | **Method** | **Purpose**            | **Auth Required** |
| --------------------------------------------- | ---------- | ---------------------- | ----------------- |
| `/quests/:questId/group/create`               | POST       | Create new group       | Yes               |
| `/quests/:questId/group/join`                 | POST       | Join existing group    | Yes               |
| `/quests/:questId/group/start`                | POST       | Initialize group quest | Yes               |
| `/quests/:questId/group-tasks/:taskId/submit` | POST       | Submit individual task | Yes               |
| `/quests/:questId/group/final-checkin`        | POST       | Complete group quest   | Yes (Leader)      |

## ✨ Implementation Benefits

1. **Schema Flexibility**

   - JSON structure allows easy extension
   - No database migrations needed
   - Future-proof for additional features

2. **Performance Considerations**

   - Index group_activity_members for efficient queries
   - Consider caching for frequent group status checks
   - Optimize batch updates for group progress

3. **Security Measures**
   - Validate group membership on all requests
   - Enforce leader-only actions
   - Rate limit group operations

## 📋 Technical Notes

1. **Query Optimization**

   - Use JSON containment operators for member searches
   - Create appropriate indexes for group lookups
   - Consider materialized views for complex group stats

2. **Error Handling**

   - Group size validation
   - Member duplicate prevention
   - Concurrent update handling

3. **Monitoring**
   - Track group creation/completion rates
   - Monitor group size distributions
   - Log failed group operations
