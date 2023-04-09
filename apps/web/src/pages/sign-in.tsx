import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="mx-auto flex w-full items-center justify-center px-4 py-10">
      <SignIn />
    </div>
  );
};

export default SignInPage;
