import type { RouterOutputs } from "@/utils/api";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { RouterInputs } from "@/utils/api";

interface UpdateCacheProps {
  client: QueryClient;
  variables: { tweetId: string };
  data: { userId: string };
  action: "like" | "unlike";
  input: RouterInputs["tweet"]["timeline"];
}

export function updateCache({
  client,
  variables,
  data,
  action,
  input,
}: UpdateCacheProps) {
  const query = { input, type: "infinite" };
  client.setQueryData([["tweet", "timeline"], query], (oldData) => {
    const newData = oldData as InfiniteData<RouterOutputs["tweet"]["timeline"]>;

    const value = action === "like" ? 1 : -1;

    const newTweets = newData.pages.map((page) => {
      return {
        tweets: page.tweets.map((tweet) => {
          if (tweet.id === variables.tweetId) {
            return {
              ...tweet,
              likes: action === "like" ? [data.userId] : [],
              _count: {
                likes: tweet._count.likes + value,
              },
            };
          }

          return tweet;
        }),
      };
    });

    return {
      ...newData,
      pages: newTweets,
    };
  });
}
