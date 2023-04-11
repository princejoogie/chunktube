import Link from "next/link";
import Image from "next/image";
import toNow from "date-fns/formatDistanceToNow";
import { useMemo } from "react";

import { api } from "../utils/api";

interface ReadNextPageProps {
  currentId: string | undefined;
}

export const ReadNextPage = ({ currentId }: ReadNextPageProps) => {
  const trending = api.list.getTopConclusions.useQuery();

  const filtered = useMemo(() => {
    return trending.data?.filter((a) => a.id !== currentId) ?? [];
  }, [currentId, trending.data]);

  return (
    <div className="mt-10">
      {trending.isLoading ? <p>Loading...</p> : null}

      {trending.data ? (
        <>
          <h2 className="text-xl font-semibold">Read Next</h2>
          {filtered.length === 0 ? (
            <p className="mt-2 text-sm text-gray-400">Nothing to see here</p>
          ) : null}

          <div className="mt-4 flex flex-col gap-4">
            {filtered.map((e) => (
              <Link
                key={e.id}
                href={`/c/${encodeURIComponent(e.url)}`}
                className="flex space-x-2 transition-opacity active:opacity-50"
              >
                {e.thumbnail ? (
                  <div className="relative aspect-video flex-1 flex-shrink-0">
                    <Image
                      width={e.thumbnail.width}
                      height={e.thumbnail.height}
                      src={e.thumbnail.url}
                      alt={`Thumbnail for ${e.title}`}
                      className="h-full w-full select-none rounded-md object-cover transition-all hover:scale-[1.02]"
                    />
                    <p className="absolute bottom-1 right-1 rounded-md bg-black/80 p-1 text-xs">
                      {e.segments[e.segments.length - 1]?.time}
                    </p>
                  </div>
                ) : null}

                <div className="flex-1">
                  <p className="mt-2 line-clamp-2 text-sm font-semibold">
                    {e.title}
                  </p>
                  <span className="text-xs text-gray-400">
                    {e.timesConcluded} concs •{" "}
                    {toNow(e.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : null}

      {trending.data && trending.data.length <= 0 ? (
        <p>No conclusions yet</p>
      ) : null}
    </div>
  );
};
