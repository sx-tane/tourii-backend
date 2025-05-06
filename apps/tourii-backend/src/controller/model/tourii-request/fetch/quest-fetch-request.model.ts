import { QuestType } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const QuestFetchRequestSchema = z.object({
	questType: z.nativeEnum(QuestType).optional().describe("Quest type filter"),
	page: z.number().default(1).describe("Page number for pagination"),
	limit: z.number().max(100).default(20).describe("Number of quests per page"),
	isPremium: z.boolean().optional().describe("Whether the quest is premium"),
	isUnlocked: z.boolean().optional().describe("Whether the quest is unlocked"),
});

export class QuestListQueryDto extends createZodDto(
	QuestFetchRequestSchema,
) {}
