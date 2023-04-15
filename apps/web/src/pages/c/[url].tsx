import Link from "next/link";
import { useRouter } from "next/router";
import { Heart, Share2 } from "lucide-react";

import Container from "~/components/container";
import ExpandingLoader from "~/components/icons/loading/expand";
import Layout from "~/components/layout";
import { ReadNextPage } from "~/components/chunks";
import { api } from "~/utils/api";
import { useAuth } from "@clerk/nextjs";

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
  const ctx = api.useContext();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { url } = router.query as { url: string };
  const vidUrl = decodeURIComponent(url);
  const conclusion = api.conclusion.get.useQuery(
    { url: vidUrl },
    { enabled: !!url, retry: false }
  );
  const isLikedQuery = api.conclusion.isLiked.useQuery(
    { conclusionId: conclusion.data?.id ?? "" },
    { enabled: Boolean(!!conclusion.data?.id && isSignedIn) }
  );
  const isLiked = Boolean(isLikedQuery.data);
  const toggleLike = api.conclusion.toggleLike.useMutation();

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
                <div className="flex items-start justify-between space-x-4">
                  <h1 className="line-clamp-2 w-full flex-1 text-xl font-semibold">
                    {conclusion.data.title}
                  </h1>

                  <div className="flex items-center space-x-2">
                    {isSignedIn ? (
                      <button
                        onClick={() => {
                          toggleLike.mutate({
                            conclusionId: conclusion.data.id,
                          });
                          ctx.conclusion.isLiked.setData(
                            { conclusionId: conclusion.data?.id ?? "" },
                            !isLiked
                          );
                          ctx.conclusion.get.setData(
                            { url: vidUrl },
                            {
                              ...conclusion.data,
                              likeCount: isLiked
                                ? conclusion.data.likeCount - 1
                                : conclusion.data.likeCount + 1,
                            }
                          );
                        }}
                        className="flex items-center rounded-full bg-gray-700 px-3 py-1 transition-all hover:bg-gray-800 active:opacity-60"
                      >
                        <Heart
                          fill={isLiked ? "#ffffff" : "none"}
                          className="m-0 h-4 w-4 p-0"
                        />
                        <span className="mb-px ml-1">
                          {conclusion.data.likeCount}
                        </span>
                      </button>
                    ) : null}

                    <button className="flex items-center rounded-full bg-gray-700 px-3 py-1 transition-all hover:bg-gray-800 active:opacity-60">
                      <Share2 className="m-0 h-4 w-4 p-0" />
                      <span className="mb-px ml-1">Share</span>
                    </button>
                  </div>
                </div>

                {conclusion.data.segments.map((segment, idx) => {
                  const before = conclusion.data.segments[idx - 1];
                  const start = before ? before.time : "00:00:00";
                  const secStart = hmsToSec(start);

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
      </Container>
    </Layout>
  );
};

export default ConclusionPage;
