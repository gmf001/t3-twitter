import { z } from "zod";

export const tweetSchema = z.object({
  text: z.string({ required_error: "tweet text is required" }).min(2).max(200),
});
