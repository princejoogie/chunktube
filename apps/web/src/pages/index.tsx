import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState } from "react";

import Container from "~/components/container";
import Layout from "~/components/layout";
import ExpandingLoader from "~/components/icons/loading/expand";
import { TrendingPage } from "~/components/trending";
import { LoadingScreen } from "~/components/loading-screen";
import { api } from "~/utils/api";

const Home = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [input, setInput] = useState("");

  const conclude = api.conclusion.create.useMutation({
    onSuccess: (data) => {
      router.push(`/c/${encodeURIComponent(data.url)}`);
    },
  });

  return (
    <Layout>
      <Container>
        {!conclude.isLoading ? <LoadingScreen /> : null}

        {!isLoaded ? (
          <div className="w-full text-center">
            <ExpandingLoader />
          </div>
        ) : (
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
        )}

        <TrendingPage />
      </Container>
    </Layout>
  );
};

export default Home;
