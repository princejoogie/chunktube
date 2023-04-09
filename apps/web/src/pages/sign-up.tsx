import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="mx-auto flex w-full items-center justify-center px-4 py-10">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
