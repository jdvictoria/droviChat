import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const fetchMessage = query({
    args: { chat_uuid: v.id('groups') },
    handler: async ({ db }, { chat_uuid }) => {
        const messages = await db
            .query('messages')
            .filter((q) => q.eq(q.field('chat_uuid'), chat_uuid))
            .collect();

        return Promise.all(
            messages.map(async (message) => {
                return message;
            })
        );
    },
});

export const sendMessage = mutation({
    args: { chat_uuid: v.id('groups'), message: v.string(), username: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert('messages', args);
    },
});
