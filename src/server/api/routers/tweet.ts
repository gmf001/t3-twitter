import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { tweetSchema } from "@/utils/validations";

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure.input(tweetSchema).mutation(({ input, ctx }) => {
    const userId = ctx.session.user.id;

    return ctx.prisma.tweet.create({
      data: {
        text: input.text,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }),

  timeline: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(10),
        where: z
          .object({
            author: z
              .object({
                name: z.string(),
              })
              .optional(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const tweets = await ctx.prisma.tweet.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          ...input.where,
        },
        include: {
          author: {
            select: {
              image: true,
              name: true,
              id: true,
            },
          },

          likes: {
            where: {
              userId: ctx.session?.user?.id,
            },
            select: {
              userId: true,
            },
          },

          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });

      let nextCursor: typeof input.cursor | undefined = undefined;

      if (tweets.length > input.limit) {
        const nextItem = tweets.pop() as (typeof tweets)[number];
        nextCursor = nextItem.id;
      }

      return {
        tweets,
        nextCursor,
      };
    }),

  like: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;

      return prisma.like.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          tweet: {
            connect: {
              id: input.tweetId,
            },
          },
        },
      });
    }),

  unlike: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;

      return prisma.like.delete({
        where: {
          tweetId_userId: {
            tweetId: input.tweetId,
            userId,
          },
        },
      });
    }),
});
