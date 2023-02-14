import { useState } from "react";
import { api } from "@/utils/api";
import { tweetSchema } from "@/utils/validations";
import { ZodError } from "zod";

function CreateTweet() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const utils = api.useContext();

  const { mutateAsync } = api.tweet.create.useMutation({
    onSuccess: async () => {
      setText("");
      setError("");
      await utils.tweet.timeline.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await tweetSchema.parseAsync({ text });
      await mutateAsync({ text });
    } catch (e) {
      if (e instanceof ZodError) {
        console.log(e.message);
        setError(e.message);
      }
      return;
    }
  };

  return (
    <>
      {error && JSON.stringify(error)}

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="mb-4 flex w-full flex-col rounded-md border-2 border-slate-800 p-4"
      >
        <textarea
          className="w-full p-4 shadow outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button
            className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            type="submit"
          >
            Tweet
          </button>
        </div>
      </form>
    </>
  );
}

export default CreateTweet;
