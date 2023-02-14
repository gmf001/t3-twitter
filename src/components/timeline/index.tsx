import { useScrollPos } from "@/hooks/useScrollPos";
import { api } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import CreateTweet from "./create-tweet";
import Tweet from "./tweet";
import type { RouterInputs } from "@/utils/api";

interface TimelineProps {
  where?: RouterInputs["tweet"]["timeline"]["where"];
}

function Timeline({ where = {} }: TimelineProps) {
  const scrollPos = useScrollPos();
  const limit = 20;

  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.tweet.timeline.useInfiniteQuery(
      { limit, where },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const client = useQueryClient();

  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

  useEffect(() => {
    if (scrollPos > 90 && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [scrollPos, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div>
      <CreateTweet />
      <div className="border-l-2 border-r-2 border-t-2 border-slate-800">
        {tweets.map((tweet) => {
          return (
            <Tweet
              key={tweet.id}
              tweet={tweet}
              client={client}
              input={{ where, limit }}
            />
          );
        })}

        {!hasNextPage && (
          <div className="py-4 text-center text-gray-500">
            <p>No more items to load</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timeline;
