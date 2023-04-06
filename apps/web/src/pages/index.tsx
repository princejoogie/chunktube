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
  });

  api.conclusion.sub.useSubscription(
    { url: input },
    {
      onData: (data) => {
        if (data.url === input) {
          setStatus(data);
        }
      },
    }
  );

  return (
    <Container>
      <h1 className="my-4 font-mono text-center">Conclusion.tech</h1>
      <form
        className="w-1/2 mx-auto flex"
        onSubmit={(e) => {
          e.preventDefault();
          conclude.mutate({ url: input });
        }}
      >
        <input
          disabled={conclude.isLoading}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent px-2 py-1 rounded border border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="youtube url"
        />
        <button
          disabled={conclude.isLoading || !input}
          type="submit"
          className="bg-green-600 px-2 py-1 rounded ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>

      {status && (
        <div className="w-1/2 mx-auto mt-6">
          <div className="bg-gray-700 h-6 rounded-full overflow-hidden">
            <div
              className="h-full bg-white animate-pulse transition-all duration-500"
              style={{ width: `${status.percentage}%` }}
            />
          </div>
          <p className="w-full text-center mt-2">
            {status.message}... {status.percentage.toFixed(2)}%
          </p>
        </div>
      )}
    </Container>
  );
};

export default Home;
