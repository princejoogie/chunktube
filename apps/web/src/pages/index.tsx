import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../utils/api";
import Container from "../components/container";

const Home = () => {
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
    onError: () => {
      setStatus({
        message: "Something went wrong",
        percentage: 0,
      });
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
    <Container>
      <Link href="/">
        <h1 className="my-4 text-center font-mono text-2xl">Conclusion.tech</h1>
      </Link>
      <fieldset disabled={conclude.isLoading}>
        <form
          className="mx-auto flex w-1/2"
          onSubmit={(e) => {
            e.preventDefault();
            conclude.mutate({ url: input });
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded border border-gray-500 bg-transparent px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="youtube url"
          />
          <button
            type="submit"
            className="ml-2 rounded bg-green-600 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit
          </button>
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
    </Container>
  );
};

export default Home;
