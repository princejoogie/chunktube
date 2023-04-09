import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import Container from "../../components/container";

const Timestamp = ({ time }: { time: string }) => {
  return (
    <div className="rounded bg-gray-800 p-1 text-xs text-gray-300 transition-all hover:bg-gray-700 active:opacity-70">
      {time}
    </div>
  );
};

const hmsToSec = (hms: string) => {
  const e = hms.split(":");
  if (e[0] && e[1] && e[2]) {
    const time = +e[0] * 60 * 60 + +e[1] * 60 + +e[2];
    return Math.max(0, time - 5);
  }
  return 0;
};

const ConclusionPage = () => {
  const router = useRouter();
  const { url } = router.query as { url: string };
  const vidUrl = decodeURIComponent(url);
  const conclusion = api.conclusion.get.useQuery(
    { url: vidUrl },
    { enabled: !!url, retry: false }
  );

  return (
    <Container>
      <Link href="/">
        <h1 className="my-4 text-center font-mono text-2xl">Conclusion.tech</h1>
      </Link>

      <div className="flex flex-col">
        {conclusion.isLoading ? (
          <p className="w-full text-center">Loading...</p>
        ) : conclusion.data ? (
          conclusion.data.segments.map((segment, idx) => {
            const before = conclusion.data.segments[idx - 1];
            const start = before ? before.time : "00:00:00";
            const end = segment.time;

            const secStart = hmsToSec(start);
            const secEnd = hmsToSec(end);

            return (
              <div key={segment.id} className="mt-6">
                <div className="flex">
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${conclusion.data.url}&t=${secStart}s`}
                  >
                    <Timestamp time={start} />
                  </Link>

                  <span className="p-1 text-xs">{">"}</span>

                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${conclusion.data.url}&t=${secEnd}s`}
                  >
                    <Timestamp time={end} />
                  </Link>
                </div>
                <p>{segment.content}</p>
              </div>
            );
          })
        ) : (
          <p className="w-full text-center">
            No data found for{" "}
            <Link target="_blank" rel="noopener noreferrer" href={vidUrl}>
              <span className="text-blue-600">{vidUrl}</span>
            </Link>
          </p>
        )}
      </div>
    </Container>
  );
};

export default ConclusionPage;
