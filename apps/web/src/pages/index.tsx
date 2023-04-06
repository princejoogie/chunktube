import { api } from "../utils/api";

const Home = () => {
  const test = api.conclude.test.useQuery({ name: "prince" });

  console.log(test);

  return (
    <div>
      <h1>Home {process.env.NEXT_PUBLIC_API_URL}</h1>
      <p>{test.data}</p>
    </div>
  );
};

export default Home;
