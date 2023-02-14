import { signIn, useSession } from "next-auth/react";

function SignedOutBanner() {
  const { data: session, status } = useSession();

  if (session || status === "loading") return null;

  return (
    <div className="fixed bottom-0 w-full bg-blue-600 p-4 py-3">
      <div className="container flex max-w-2xl items-center justify-between">
        <p className="text-base font-bold uppercase">Welcome to T3-Twitter</p>
        <div>
          <button className="px-4 py-2 font-bold" onClick={() => void signIn()}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignedOutBanner;
