import { useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Eye } from "lucide-react";

import type { RouterOutputs } from "@ct/api";

import { api } from "@/utils/api";
import { bigNumber } from "@/utils/helpers";

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

export type ChunkCardProps = {
  chunk: RouterOutputs["list"]["getTopChunks"]["chunks"][number];
};

export const ChunkCard = ({ chunk }: ChunkCardProps) => {
  return (
    <Link
      className="transition-opacity active:opacity-50"
      href={`/c/${encodeURIComponent(chunk.url)}`}
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
            alt={`Thumbnail for ${chunk.title}`}
            className="h-full w-full select-none rounded-md object-cover transition-all hover:scale-[1.02]"
            height={chunk.thumbnail.height}
            src={chunk.thumbnail.url}
            width={chunk.thumbnail.width}
          />
          <p className="absolute bottom-1 right-1 rounded-md bg-black/80 p-1 text-xs">
            {chunk.segments[chunk.segments.length - 1]?.time}
          </p>
        </div>
      )}

      <p className="mt-2 line-clamp-2 font-semibold">{chunk.title}</p>
      <span className="block text-sm text-gray-400">
        {bigNumber(chunk.timesConcluded)} concludes •{" "}
        {formatDistanceToNow(chunk.createdAt, { addSuffix: true })}
      </span>
      <div className="flex items-center space-x-1 text-sm text-gray-400">
        <Eye className="h-4 w-4" />
        <span>{bigNumber(chunk.timesViewed)} views</span>
      </div>
    </Link>
  );
};

type SideChunkCardProps = {
  chunk: RouterOutputs["list"]["getTopChunks"]["chunks"][number];
};

export const SideChunkCard = ({ chunk }: SideChunkCardProps) => {
  return (
    <Link
      className="flex space-x-2 transition-opacity active:opacity-50"
      href={`/c/${encodeURIComponent(chunk.url)}`}
      key={chunk.id}
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
            alt={`Thumbnail for ${chunk.title}`}
            className="h-full w-full select-none rounded-md object-cover transition-all hover:scale-[1.02]"
            height={chunk.thumbnail.height}
            src={chunk.thumbnail.url}
            width={chunk.thumbnail.width}
          />
          <p className="absolute bottom-1 right-1 rounded-md bg-black/80 p-1 text-xs">
            {chunk.segments[chunk.segments.length - 1]?.time}
          </p>
        </div>
      )}

      <div className="flex-1">
        <p className="mt-2 line-clamp-2 text-sm font-semibold">{chunk.title}</p>
        <span className="text-xs text-gray-400">
          {bigNumber(chunk.timesConcluded)} concs •{" "}
          {formatDistanceToNow(chunk.createdAt, { addSuffix: true })}
        </span>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <Eye className="h-4 w-4" />
          <span>{bigNumber(chunk.timesViewed)} views</span>
        </div>
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
          <ChunkCard chunk={c} key={c.id} />
        ))}
      </div>

      {e.isLoading || e.isFetchingNextPage ? <ChunkCardLoader /> : null}

      {e.hasNextPage ? (
        <div className="mt-4 flex w-full items-center justify-center">
          <button
            className="text-blue-600 active:opacity-60"
            onClick={() => e.fetchNextPage()}
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
          <ChunkCard chunk={c} key={c.id} />
        ))}
      </div>

      {e.isLoading || e.isFetchingNextPage ? <ChunkCardLoader /> : null}

      {e.hasNextPage ? (
        <div className="mt-4 flex w-full items-center justify-center">
          <button
            className="text-blue-600 active:opacity-60"
            onClick={() => e.fetchNextPage()}
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
          <ChunkCard chunk={c} key={c.id} />
        ))}
      </div>

      {e.isLoading || e.isFetchingNextPage ? <ChunkCardLoader /> : null}

      {e.hasNextPage ? (
        <div className="mt-4 flex w-full items-center justify-center">
          <button
            className="text-blue-600 active:opacity-60"
            onClick={() => e.fetchNextPage()}
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

type ReadNextPageProps = {
  currentId: string | undefined;
};

export const ReadNextPage = ({ currentId }: ReadNextPageProps) => {
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

  const filtered = useMemo(() => {
    return chunks().filter((a) => a.id !== currentId);
  }, [currentId, chunks]);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold">Read Next</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
        {filtered.map((e) => (
          <SideChunkCard chunk={e} key={e.id} />
        ))}
      </div>

      {e.hasNextPage ? (
        <div className="mt-4 flex w-full items-center justify-center">
          <button
            className="text-blue-600 active:opacity-60"
            onClick={() => e.fetchNextPage()}
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
