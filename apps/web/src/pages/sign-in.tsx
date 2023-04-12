import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="mx-auto flex min-h-screen w-full items-center justify-center p-4">
      <SignIn />
    </div>
  );
};

export default SignInPage;
