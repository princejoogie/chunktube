import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <div className="px-4 max-w-5xl w-full mx-auto">{children}</div>;
};

export default Container;
