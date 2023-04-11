import Link from "next/link";
import { useRouter } from "next/router";

import Container from "../../components/container";
import ExpandingLoader from "../../components/icons/loading/expand";
import Layout from "../../components/layout";

import { ReadNextPage } from "../../components/read-next";
import { api } from "../../utils/api";

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
    <Layout
      seo={conclusion.data ? { title: conclusion.data?.title } : undefined}
    >
      <Container>
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="mb-10 flex w-full flex-col xl:w-9/12">
            {conclusion.isLoading ? (
              <div className="w-full text-center">
                <ExpandingLoader />
              </div>
            ) : conclusion.data ? (
              <>
                <h1 className="w-full text-xl font-semibold">
                  {conclusion.data.title}
                </h1>

                {conclusion.data.segments.map((segment, idx) => {
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
                      <p className="text-gray-200">{segment.content}</p>
                    </div>
                  );
                })}
              </>
            ) : (
              <p className="w-full text-center">
                No data found for{" "}
                <Link target="_blank" rel="noopener noreferrer" href={vidUrl}>
                  <span className="text-blue-600">{vidUrl}</span>
                </Link>
              </p>
            )}
          </div>

          <hr className="border-gray-800" />

          <div className="w-full xl:w-3/12">
            <ReadNextPage currentId={conclusion.data?.id} />
          </div>
        </div>

        <div className="h-20 w-full" />
      </Container>
    </Layout>
  );
};

export default ConclusionPage;
