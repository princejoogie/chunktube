import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <div className="mx-auto w-full max-w-5xl px-4">{children}</div>;
};

export default Container;
