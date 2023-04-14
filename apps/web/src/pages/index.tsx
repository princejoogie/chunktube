import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState } from "react";

import Container from "~/components/container";
import Layout from "~/components/layout";
import { TrendingPage } from "~/components/trending";
import { LoadingScreen } from "~/components/loading-screen";
import { api } from "~/utils/api";
import { useToast } from "~/hooks/use-toast";
import { getAuth } from "@clerk/nextjs/server";

const Home = ({ token }: { token: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [input, setInput] = useState("");

  const conclude = api.conclusion.create.useMutation({
    onSuccess: (data) => {
      router.push(`/c/${encodeURIComponent(data.url)}`);
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Layout token={token}>
      <Container>
        {conclude.isLoading ? <LoadingScreen /> : null}

        <fieldset disabled={conclude.isLoading || !isSignedIn || !isLoaded}>
          <form
            className="mx-auto mt-4 w-full xl:w-3/4"
            onSubmit={(e) => {
              e.preventDefault();
              conclude.mutate({ url: input, token });
            }}
          >
            <div className="flex w-full overflow-hidden rounded-full border border-gray-600">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded bg-transparent p-2 px-4 outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={isSignedIn ? "YouTube url" : "Sign in to continue"}
              />
              <button
                type="submit"
                className="ml-2 flex items-center border-l border-gray-500 bg-green-600 px-4 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!input}
              >
                <span className="mr-2 hidden md:inline-flex">Conclude</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </fieldset>

        <TrendingPage />
      </Container>
    </Layout>
  );
};

export const getServerSideProps = async (ctx: any) => {
  const token = await getAuth(ctx.req).getToken();
  return {
    props: {
      token,
    },
  };
};

export default Home;
