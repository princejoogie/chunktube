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
          className="text-blue-300"
          href="https://github.com/princejoogie"
          rel="noopener noreferrer"
          target="_blank"
        >
          Prince Carlo Juguilon
        </a>{" "}
        © {new Date().getFullYear()}
      </p>

      <div className="flex space-x-3">
        <a href={links.github} rel="noopener noreferrer" target="_blank">
          <Github className="h-4 w-4" />
        </a>

        <a href={links.twitter} rel="noopener noreferrer" target="_blank">
          <Twitter className="h-4 w-4" />
        </a>

        <a href={links.linkedin} rel="noopener noreferrer" target="_blank">
          <Linkedin className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
