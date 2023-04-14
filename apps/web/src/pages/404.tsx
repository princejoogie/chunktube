import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h2 className="text-3xl font-bold">404 Page Not Found</h2>
      <Link href="/">
        <p className="mt-2 text-lg text-blue-600">Go Home</p>
      </Link>
    </div>
  );
};

export default NotFoundPage;
