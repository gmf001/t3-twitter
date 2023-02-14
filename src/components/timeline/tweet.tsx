import cn from "clsx";
import { api } from "@/utils/api";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { AiFillHeart } from "react-icons/ai";
import { updateCache } from "./updateCache";
import type { RouterOutputs, RouterInputs } from "@/utils/api";
import type { QueryClient } from "@tanstack/react-query";
import Link from "next/link";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "1s",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

interface TweetProps {
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
  input: RouterInputs["tweet"]["timeline"];
  client: QueryClient;
}

function Tweet({ tweet, client, input }: TweetProps) {
  const likeMutation = api.tweet.like.useMutation({
    onSuccess(data, variables) {
      updateCache({ client, variables, data, input, action: "like" });
    },
  }).mutateAsync;

  const unlikeMutation = api.tweet.unlike.useMutation({
    onSuccess(data, variables) {
      updateCache({ client, variables, data, input, action: "unlike" });
    },
  }).mutateAsync;

  const hasLiked = tweet.likes.length > 0;

  const handleLike = () => {
    if (hasLiked) {
      void unlikeMutation({ tweetId: tweet.id });
    } else {
      void likeMutation({ tweetId: tweet.id });
    }
  };

  return (
    <div className="mb-4 border-b-2 border-slate-800">
      <div className="flex p-2">
        {tweet.author.image ? (
          <Image
            src={tweet.author.image}
            alt={tweet.author.name || ""}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full"
          />
        ) : null}

        <div className="ml-2">
          <div className="flex items-center space-x-2">
            <p className="font-bold">
              <Link href={`/${String(tweet.author.name)}`}>
                {tweet.author.name}
              </Link>
            </p>
            <p className="text-sm text-slate-400">
              - {dayjs(tweet.createdAt).fromNow()}
            </p>
          </div>
          <div>{tweet.text}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2 p-2">
        <AiFillHeart
          onClick={() => void handleLike()}
          className={cn(
            hasLiked ? "text-red-500" : "text-slate-500",
            "h-5 w-5 cursor-pointer"
          )}
        />
        <span className="text-sm font-semibold text-slate-500">
          {tweet._count.likes}
        </span>
      </div>
    </div>
  );
}

export default Tweet;
