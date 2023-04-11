/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import toNow from "date-fns/formatDistanceToNow";
import { api } from "../utils/api";

export const TrendingPage = () => {
  const trending = api.list.getTopConclusions.useQuery();

  return (
    <div className="mt-10">
      {trending.isLoading ? <p>Loading...</p> : null}

      {trending.data && trending.data.length <= 0 ? (
        <p>No conclusions yet</p>
      ) : null}

      {trending.data ? (
        <>
          <h2 className="text-xl font-semibold">Trending</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {trending.data?.map((e) => (
              <Link
                key={e.id}
                href={`/c/${encodeURIComponent(e.url)}`}
                className="transition-opacity active:opacity-50"
              >
                <div className="relative aspect-video w-full">
                  <img
                    src={e.thumbnail}
                    alt={`Thumbnail for ${e.title}`}
                    className="h-full w-full select-none rounded-md object-cover transition-all hover:scale-[1.02]"
                  />
                  <p className="absolute bottom-1 right-1 rounded-md bg-black/80 p-1 text-xs">
                    {e.segments[e.segments.length - 1]?.time}
                  </p>
                </div>
                <p className="mt-2 font-semibold">{e.title}</p>
                <span className="text-sm text-gray-400">
                  {e.timesConcluded} concludes •{" "}
                  {toNow(e.createdAt, { addSuffix: true })}
                </span>
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};
