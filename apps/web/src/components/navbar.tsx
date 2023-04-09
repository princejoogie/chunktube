import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Container from "./container";

const Navbar = () => {
  return (
    <nav className="">
      <Container>
        <div className="my-4 flex items-center justify-between gap-4">
          <div>
            <Link href="/">
              <h1 className="font-mono text-2xl">Conclusion.tech</h1>
            </Link>
          </div>

          <div>
            <SignedIn>
              {/* Mount the UserButton component */}
              <div>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-12 w-12 border-2 border-gray-600",
                    },
                  }}
                />
              </div>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in">
                <span>Sign in</span>
              </Link>
            </SignedOut>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
