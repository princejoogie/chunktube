import { useRouter } from "next/router";
import { api } from "../../utils/api";
import Container from "../../components/container";

const Timestamp = ({ time }: { time: string }) => {
  return (
    <div className="bg-gray-800 p-1 text-gray-300 text-xs rounded">{time}</div>
  );
};

const ConclusionPage = () => {
  const router = useRouter();
  const { url } = router.query as { url: string };
  const vidUrl = decodeURIComponent(url);
  const conclusion = api.conclusion.get.useQuery({ url: vidUrl });

  return (
    <Container>
      <h1 className="my-4 font-mono text-center">Conclusion.tech</h1>

      <div className="flex flex-col">
        {conclusion.data?.segments.map((segment, idx) => (
          <div key={segment.id} className="mt-6">
            <div className="flex">
              <Timestamp
                time={
                  idx === 0
                    ? "00:00:00"
                    : conclusion.data.segments[idx - 1].time
                }
              />
              <span className="text-xs p-1">{">"}</span>
              <Timestamp time={segment.time} />
            </div>
            <p>{segment.content}</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ConclusionPage;
