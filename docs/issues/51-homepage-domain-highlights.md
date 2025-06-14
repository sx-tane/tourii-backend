# \ud83e\udd14 [BE] Homepage Domain \u2013 Get Latest Chapter & Popular Quest

**Issue #51**

---

### \ud83c\udfaf Purpose

Build the backend logic to power the homepage highlights, which includes:

1. \u2705 The **latest published story chapter** with image and deep link
2. \ud83d\udd25 The **most popular quest** (based on completed tasks), with image and deep link

---

### \ud83d\udcc5 Endpoint

`GET /v2/homepage/highlights`

---

### \ud83d\udce4 Response Example

```ts
{
  latestChapter: {
    storyId: "story-001",
    chapterId: "chapter-015",
    title: "The Whispering Grove",
    imageUrl: "https://cdn.tourii.xyz/chapters/chapter-015-cover.jpg",
    link: "/v2/touriiverse/story-001/chapters/chapter-015"
  },
  popularQuest: {
    questId: "quest-789",
    title: "Discover Kyoto's Hidden Shrines",
    imageUrl: "https://cdn.tourii.xyz/quests/kyoto-hidden-shrines.jpg",
    link: "/v2/quest/quest-789"
  }
}
```

---

### \ud83d\udccc Logic

#### \u2705 Latest Chapter (with image)

* Find latest `storyChapter` where `publishedAt IS NOT NULL`
* Include `storyId` and `coverImage` (or `imageUrl`)
* Build deep link as:
  `/v2/touriiverse/${storyId}/chapters/${chapterId}`

#### \ud83d\udd25 Popular Quest (with image)

1. Count completed tasks in `user_task_log`
   * `status = COMPLETED`
   * Group by `questTaskId`
   * Sort by highest count
2. Trace to `questTask \u2192 quest` and get:
   * `questId`, `title`, `imageUrl`
   * Build link as: `/v2/quest/${questId}`

---

### \ud83e\udd84 Suggested Pseudocode

```ts
const latestChapter = await prisma.storyChapter.findFirst({
  where: { publishedAt: { not: null } },
  orderBy: { publishedAt: 'desc' },
  include: { story: true },
});

const mostCompleted = await prisma.userTaskLog.groupBy({
  by: ['questTaskId'],
  where: { status: 'COMPLETED' },
  _count: { questTaskId: true },
  orderBy: { _count: { questTaskId: 'desc' } },
  take: 1,
});

const popularQuest = await prisma.questTask.findUnique({
  where: { questTaskId: mostCompleted[0].questTaskId },
  include: { quest: true },
});
```

---

### \ud83e\uddea TODOs

* [ ] Add `/v2/homepage/highlights` endpoint
* [ ] Fetch `latestChapter` including image
* [ ] Fetch `popularQuest` based on most completed `user_task_log`, including image
* [ ] Return proper structured response with image URLs and frontend links

---

### \ud83e\uddea Test Cases

* \u2705 Returns latest chapter with title, image, and deep link
* \u2705 Returns most popular quest with title, image, and deep link
* \u274c Gracefully handles no data cases

