import { Github, Twitter, Linkedin } from "lucide-react";

const links = {
  github: "https://github.com/princejoogie",
  twitter: "https://twitter.com/princecaarlo",
  linkedin: "https://linkedin.com/in/princejoogie",
};

const Footer = () => {
  return (
    <footer className="fixed bottom-0 flex w-full items-center justify-between bg-gray-800 p-2 text-sm text-gray-300">
      <p>
        Created by{" "}
        <a
          href="https://github.com/princejoogie"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300"
        >
          Prince Carlo Juguilon
        </a>{" "}
        © {new Date().getFullYear()}
      </p>

      <div className="flex space-x-3">
        <a href={links.github} target="_blank" rel="noopener noreferrer">
          <Github className="h-4 w-4" />
        </a>

        <a href={links.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter className="h-4 w-4" />
        </a>

        <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
