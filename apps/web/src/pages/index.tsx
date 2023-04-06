import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../utils/api";
import Container from "../components/container";

const Home = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const conclude = api.conclusion.create.useMutation({
    onSuccess: (data) => {
      router.push(`/c/${encodeURIComponent(data.url)}`);
    },
  });

  return (
    <Container>
      <h1>Conclusion.tech</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          conclude.mutate({ url: input });
        }}
      >
        <input
          disabled={conclude.isLoading}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent px-2 py-1 rounded border border-gray-500"
          placeholder="youtube url"
        />
        <button disabled={conclude.isLoading} type="submit">
          Submit
        </button>
      </form>

      {conclude.isLoading && <div>Loading...</div>}
    </Container>
  );
};

export default Home;
