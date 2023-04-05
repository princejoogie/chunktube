import { prisma } from "db";

const main = async () => {
  console.log("Hello from api!");

  const user = await prisma.user.findUnique({
    where: { username: "pricejoogie" },
  });
  if (user) {
    console.log("User found: ", user);
  } else {
    console.log("User not found");
  }
};

main().catch(console.error);
