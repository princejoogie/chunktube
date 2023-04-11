import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState } from "react";

import Container from "../components/container";
import Layout from "../components/layout";
import ExpandingLoader from "../components/icons/loading/expand";
import { TrendingPage } from "../components/trending";

import { api } from "../utils/api";

const Home = () => {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<{
    message: string;
    percentage: number;
  } | null>(null);

  const conclude = api.conclusion.create.useMutation({
    onSuccess: (data) => {
      router.push(`/c/${encodeURIComponent(data.url)}`);
    },
  });

  api.conclusion.sub.useSubscription(
    { url: input },
    {
      enabled: conclude.isLoading,
      onData: (data) => {
        console.log(data.url, input);
        if (data.url === input) {
          setStatus(data);
        }
      },
    }
  );

  return (
    <Layout>
      <Container>
        {!isLoaded ? (
          <div className="w-full text-center">
            <ExpandingLoader />
          </div>
        ) : (
          <>
            <fieldset disabled={conclude.isLoading || !isSignedIn}>
              <form
                className="mx-auto w-3/4"
                onSubmit={(e) => {
                  e.preventDefault();
                  conclude.mutate({ url: input });
                }}
              >
                <div className="flex w-full overflow-hidden rounded-full border border-gray-600">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 rounded bg-transparent p-2 px-4 outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={
                      isSignedIn ? "YouTube url" : "Sign in to continue"
                    }
                  />
                  <button
                    type="submit"
                    className="ml-2 border-l border-gray-500 bg-green-600 px-4 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Conclude
                  </button>
                </div>
              </form>
            </fieldset>

            {status && (
              <div className="mx-auto mt-6 w-1/2">
                <div className="h-4 overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full animate-pulse bg-white transition-all duration-500"
                    style={{ width: `${status.percentage}%` }}
                  />
                </div>
                <p className="mt-2 w-full text-center text-sm text-gray-300">
                  {status.message}... {status.percentage.toFixed(2)}%
                </p>
              </div>
            )}
          </>
        )}

        <TrendingPage />
      </Container>
    </Layout>
  );
};

export default Home;
