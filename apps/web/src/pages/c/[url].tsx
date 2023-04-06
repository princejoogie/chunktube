import { useRouter } from "next/router";
import { api } from "../../utils/api";
import Container from "../../components/container";

const ConclusionPage = () => {
  const router = useRouter();
  const { url } = router.query as { url: string };
  const vidUrl = decodeURIComponent(url);
  const conclusion = api.conclusion.get.useQuery({ url: vidUrl });

  return (
    <Container>
      <h1>Conclusion.tech</h1>

      <div>
        {conclusion.data?.segments.map((segment) => (
          <div key={segment.id} className="mt-4">
            <span>{segment.time}</span>
            <p>{segment.content}</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ConclusionPage;
