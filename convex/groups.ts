import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const fetchAllGroups = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("groups").collect();
    },
});

export const fetchSingleGroup = query({
    args: { id: v.id("groups") },
    handler: async (ctx, { id }) => {
        return await ctx.db
            .query("groups")
            .filter((q) => q.eq(q.field("_id"), id))
            .unique();
    },
});

export const createGroup = mutation({
    args: { description: v.string(), title: v.string(), icon: v.string() },
    handler: async ({ db }, args) => {
        await db.insert("groups", args);
    },
});
