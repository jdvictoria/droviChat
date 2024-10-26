import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    groups: defineTable({
        description: v.string(),
        icon: v.string(),
        title: v.string()
    }),
    messages: defineTable({
        chat_uuid: v.id('groups'),
        username: v.string(),
        message: v.string()
    })
});
