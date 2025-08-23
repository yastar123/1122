import { relations } from "drizzle-orm/relations";
import { prizes, participants, submissions } from "./schema";

export const participantsRelations = relations(participants, ({one}) => ({
	prize: one(prizes, {
		fields: [participants.prizeId],
		references: [prizes.id]
	}),
}));

export const prizesRelations = relations(prizes, ({many}) => ({
	participants: many(participants),
	submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({one}) => ({
	prize: one(prizes, {
		fields: [submissions.prizeId],
		references: [prizes.id]
	}),
}));