import { useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import toNow from "date-fns/formatDistanceToNow";
import type { RouterOutputs } from "api";

import { api } from "~/utils/api";

const delays = ["delay-100", "delay-200", "delay-300", "delay-500"];

export const ChunkCardLoader = () => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array(8)
        .fill(null)
        .map((_, i) => {
          const c = delays[i % delays.length] ?? "delay-0";
          return (
            <div key={`TrendingPageLoader-${i}`}>
              <div
                className={`aspect-video w-full animate-pulse rounded-md bg-gray-800 ${c}`}
              />
              <p className="mt-2 line-clamp-2 h-6 w-[70%] rounded bg-gray-700 font-semibold" />
              <p className="mt-1 h-4 w-[45%] rounded bg-gray-800 text-sm text-gray-400" />
            </div>
          );
        })}
    </div>
  );
};

export interface ChunkCardProps {
  chunk: RouterOutputs["list"]["getTopChunks"]["chunks"][number];
}

export const ChunkCard = ({ chunk }: ChunkCardProps) => {
  return (
    <Link
      href={`/c/${encodeURIComponent(chunk.url)}`}
      className="transition-opacity active:opacity-50"
    >
      {!chunk.thumbnail ? (
        <div className="relative aspect-video w-full animate-pulse rounded-md bg-gray-800">
          <p className="absolute bottom-1 right-1 rounded-md bg-black/80 p-1 text-xs">
            {chunk.segments[chunk.segments.length - 1]?.time}
          </p>
        </div>
      ) : (
        <div className="relative aspect-video w-full">
          <Image
            priority
            width={chunk.thumbnail.width}
            height={chunk.thumbnail.height}
            src={chunk.thumbnail.url}
            alt={`Thumbnail for ${chunk.title}`}
            className="h-full w-full select-none rounded-md object-cover transition-all hover:scale-[1.02]"
          />
          <p className="absolute bottom-1 right-1 rounded-md bg-black/80 p-1 text-xs">
            {chunk.segments[chunk.segments.length - 1]?.time}
          </p>
        </div>
      )}

      <p className="mt-2 line-clamp-2 font-semibold">{chunk.title}</p>
      <span className="text-sm text-gray-400">
        {chunk.timesConcluded} concludes •{" "}
        {toNow(chunk.createdAt, { addSuffix: true })}
      </span>
    </Link>
  );
};

interface SideChunkCardProps {
  chunk: RouterOutputs["list"]["getTopChunks"]["chunks"][number];
}

export const SideChunkCard = ({ chunk }: SideChunkCardProps) => {
  return (
    <Link
      key={chunk.id}
      href={`/c/${encodeURIComponent(chunk.url)}`}
      className="flex space-x-2 transition-opacity active:opacity-50"
    >
      {!chunk.thumbnail ? (
        <div className="relative aspect-video flex-1 flex-shrink-0 animate-pulse rounded-md bg-gray-800">
          <p className="absolute bottom-1 right-1 rounded-md bg-black/80 p-1 text-xs">
            {chunk.segments[chunk.segments.length - 1]?.time}
          </p>
        </div>
      ) : (
        <div className="relative aspect-video flex-1 flex-shrink-0">
          <Image
            priority
            width={chunk.thumbnail.width}
            height={chunk.thumbnail.height}
            src={chunk.thumbnail.url}
            alt={`Thumbnail for ${chunk.title}`}
            className="h-full w-full select-none rounded-md object-cover transition-all hover:scale-[1.02]"
          />
          <p className="absolute bottom-1 right-1 rounded-md bg-black/80 p-1 text-xs">
            {chunk.segments[chunk.segments.length - 1]?.time}
          </p>
        </div>
      )}

      <div className="flex-1">
        <p className="mt-2 line-clamp-2 text-sm font-semibold">{chunk.title}</p>
        <span className="text-xs text-gray-400">
          {chunk.timesConcluded} concs •{" "}
          {toNow(chunk.createdAt, { addSuffix: true })}
        </span>
      </div>
    </Link>
  );
};

export const TrendingChunks = () => {
  const e = api.list.getTopChunks.useInfiniteQuery(
    { filter: "trending", limit: 8 },
    { getNextPageParam: (lastPage) => lastPage.cursor }
  );

  const chunks = useCallback(() => {
    if (e.data) {
      return e.data?.pages.flatMap((p) => p.chunks);
    }
    return [];
  }, [e.data]);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold">Trending</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {chunks().map((c) => (
          <ChunkCard key={c.id} chunk={c} />
        ))}
      </div>

      {e.isLoading || e.isFetchingNextPage ? <ChunkCardLoader /> : null}

      {e.hasNextPage ? (
        <div className="mt-4 flex w-full items-center justify-center">
          <button
            onClick={() => e.fetchNextPage()}
            className="text-blue-600 active:opacity-60"
          >
            See more
          </button>
        </div>
      ) : (
        <p className="mt-6 w-full text-center text-sm text-gray-400">
          Nothing else to see here
        </p>
      )}
    </div>
  );
};

export const RecentChunks = () => {
  const e = api.list.getTopChunks.useInfiniteQuery(
    { filter: "newest", limit: 8 },
    { getNextPageParam: (lastPage) => lastPage.cursor }
  );

  const chunks = useCallback(() => {
    if (e.data) {
      return e.data?.pages.flatMap((p) => p.chunks);
    }
    return [];
  }, [e.data]);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold">Most Recent</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {chunks().map((c) => (
          <ChunkCard key={c.id} chunk={c} />
        ))}
      </div>

      {e.isLoading || e.isFetchingNextPage ? <ChunkCardLoader /> : null}

      {e.hasNextPage ? (
        <div className="mt-4 flex w-full items-center justify-center">
          <button
            onClick={() => e.fetchNextPage()}
            className="text-blue-600 active:opacity-60"
          >
            See more
          </button>
        </div>
      ) : (
        <p className="mt-6 w-full text-center text-sm text-gray-400">
          Nothing else to see here
        </p>
      )}
    </div>
  );
};

export const MyChunks = () => {
  const e = api.list.getTopChunks.useInfiniteQuery(
    { filter: "mine", limit: 8 },
    { getNextPageParam: (lastPage) => lastPage.cursor }
  );

  const chunks = useCallback(() => {
    if (e.data) {
      return e.data?.pages.flatMap((p) => p.chunks);
    }
    return [];
  }, [e.data]);

  return (
    <div className="mt-10 w-full">
      <h2 className="text-xl font-semibold">Your Chunks</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {chunks().map((c) => (
          <ChunkCard key={c.id} chunk={c} />
        ))}
      </div>

      {e.isLoading || e.isFetchingNextPage ? <ChunkCardLoader /> : null}

      {e.hasNextPage ? (
        <div className="mt-4 flex w-full items-center justify-center">
          <button
            onClick={() => e.fetchNextPage()}
            className="text-blue-600 active:opacity-60"
          >
            See more
          </button>
        </div>
      ) : (
        <p className="mt-6 w-full text-center text-sm text-gray-400">
          Nothing else to see here
        </p>
      )}
    </div>
  );
};

interface ReadNextPageProps {
  currentId: string | undefined;
}

export const ReadNextPage = ({ currentId }: ReadNextPageProps) => {
  const e = api.list.getTopChunks.useInfiniteQuery(
    { filter: "trending", limit: 15 },
    { getNextPageParam: (lastPage) => lastPage.cursor }
  );

  const chunks = useCallback(() => {
    if (e.data) {
      return e.data?.pages.flatMap((p) => p.chunks);
    }
    return [];
  }, [e.data]);

  const filtered = useMemo(() => {
    return chunks().filter((a) => a.id !== currentId);
  }, [currentId, chunks]);

  return (
    <div className="mt-10">
      {e.isLoading ? <p>Loading...</p> : null}

      <h2 className="text-xl font-semibold">Read Next</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
        {filtered.map((e) => (
          <SideChunkCard key={e.id} chunk={e} />
        ))}
      </div>

      {e.hasNextPage ? (
        <div className="mt-4 flex w-full items-center justify-center">
          <button
            onClick={() => e.fetchNextPage()}
            className="text-blue-600 active:opacity-60"
          >
            See more
          </button>
        </div>
      ) : (
        <p className="mt-2 text-sm text-gray-400">Nothing else to see here</p>
      )}
    </div>
  );
};
