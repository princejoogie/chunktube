import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Heart, Share2, Eye, ExternalLink } from "lucide-react";
import { type RouterOutputs } from "api";
import toNow from "date-fns/formatDistanceToNow";

import Container from "~/components/container";
import ExpandingLoader from "~/components/icons/loading/expand";
import Layout from "~/components/layout";
import { ReadNextPage } from "~/components/chunks";
import { api } from "~/utils/api";
import { bigNumber, getVideoId } from "~/utils/helpers";
import { useEffect } from "react";

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

type ChannelDetailsProps = {
  details: RouterOutputs["conclusion"]["get"]["channelDetails"];
};

const ChannelDetails = ({ details }: ChannelDetailsProps) => {
  return details ? (
    <Link
      href={`https://youtube.com/${details.username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex"
    >
      <div className="flex space-x-3 self-start rounded-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={details.thumbnail.url}
          alt={details.channelName}
          className="h-14 w-14 rounded-full"
        />

        <div className="flex flex-col justify-center">
          <div className="flex items-center">
            <p className="mr-2 font-semibold text-white">
              {details.channelName}
            </p>
            <ExternalLink className="h-4 w-4" />
          </div>
          {!details.hiddenSubscriberCount && (
            <p className="text-sm text-gray-400">
              {bigNumber(+details.subscriberCount)} subscribers
            </p>
          )}
        </div>
      </div>
    </Link>
  ) : null;
};

const ConclusionPage = () => {
  const ctx = api.useContext();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { url } = router.query as { url: string };
  const vidUrl = decodeURIComponent(url);
  const addView = api.conclusion.addView.useMutation();
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

  useEffect(() => {
    if (vidUrl) {
      try {
        const videoId = getVideoId(vidUrl);
        addView.mutate({ videoId });
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vidUrl]);

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
                  <h1 className="line-clamp-2 w-full flex-1 text-2xl font-semibold">
                    {conclusion.data.title}
                  </h1>

                  <div className="flex items-center space-x-2 text-gray-300">
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
                          className={`m-0 h-4 w-4 p-0 ${
                            isLiked ? "fill-gray-300" : "fill-none"
                          }`}
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

                <div className="mt-6 flex items-center justify-between">
                  <ChannelDetails details={conclusion.data.channelDetails} />

                  <div className="flex flex-col items-end text-sm text-gray-400">
                    <div className="flex items-center rounded-full">
                      <Eye className="m-0 h-5 w-5 p-0" />
                      <span className="mb-px ml-1">
                        {bigNumber(conclusion.data.timesViewed)} views
                      </span>
                    </div>

                    <p>
                      {toNow(conclusion.data.createdAt, { addSuffix: true })}
                    </p>
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
