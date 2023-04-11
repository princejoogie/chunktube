import Link from "next/link";
import { useUser, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Container from "./container";

const Navbar = () => {
  const { isLoaded } = useUser();

  return (
    <nav className="">
      <Container>
        <div className="my-4 flex items-center justify-between gap-4">
          <div>
            <Link href="/">
              <h3 className="font-mono text-2xl">Conclusion.tech</h3>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {!isLoaded ? (
              <div className="h-12 w-12 animate-pulse rounded-full border-2 border-gray-600 bg-gray-800" />
            ) : (
              <>
                <SignedIn>
                  <div className="flex gap-2">
                    <button className="rounded-xl bg-gray-700 px-4 py-1 transition-all hover:bg-gray-800 active:opacity-70">
                      5 Credits
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
