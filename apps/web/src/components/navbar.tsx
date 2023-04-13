import Image from "next/image";
import Link from "next/link";
import { useUser, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Container from "./container";
import { trpc } from "~/utils/api";

const Navbar = ({ token }: { token: string }) => {
  const { isLoaded, isSignedIn } = useUser();

  const me = trpc.user.me.useQuery(
    { token },
    { enabled: isSignedIn && !!token }
  );

  return (
    <nav className="">
      <Container>
        <div className="my-4 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="h-14 w-14">
                <Image
                  src="/assets/logo.svg"
                  width={1024}
                  height={1024}
                  alt="ChunkTube logo"
                />
              </div>
              <h3 className="font-mono text-2xl font-bold">ChunkTube</h3>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {!isLoaded ? (
              <div className="h-12 w-12 animate-pulse rounded-full border-2 border-gray-600 bg-gray-800" />
            ) : (
              <>
                <SignedIn>
                  <div className="flex gap-2">
                    <button
                      disabled={!me.data}
                      className="rounded-xl bg-gray-700 px-4 py-1 transition-all hover:bg-gray-800 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-700"
                    >
                      {me.data?.credits ?? "0"}{" "}
                      {me.data?.credits === 1 ? "Credit" : "Credits"}
                    </button>

                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox:
                            "h-12 w-12 border-2 border-gray-600",
                        },
                      }}
                    />
                  </div>
                </SignedIn>

                <SignedOut>
                  <div className="grid h-12 place-items-center text-center">
                    <Link href="/sign-in">
                      <span>Sign in</span>
                    </Link>
                  </div>
                </SignedOut>
              </>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
