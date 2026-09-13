export interface Skill {
  id: string;
  name: string;
  icon: string;
  color: string;
  level?: string;
  group: "lang" | "tools" | "ai";
  emphasis?: "primary" | "secondary";
}

export const skills: Skill[] = [
  // Linguagens & Tecnologias
  { id: "html5", name: "HTML5", icon: "/img/icons/html5.svg", color: "#E34F26", group: "lang", emphasis: "primary" },
  { id: "css3", name: "CSS3", icon: "/img/icons/css3.svg", color: "#1572B6", group: "lang", emphasis: "primary" },
  { id: "javascript", name: "JavaScript", icon: "/img/icons/javascript.svg", color: "#F7DF1E", group: "lang", emphasis: "primary" },
  { id: "typescript", name: "TypeScript", icon: "/img/icons/typescript.svg", color: "#3178C6", group: "lang", emphasis: "primary" },
  { id: "react", name: "React", icon: "/img/icons/react.svg", color: "#149ECA", group: "lang", emphasis: "primary" },
  { id: "nextjs", name: "Next.js", icon: "/img/icons/nextdotjs.svg", color: "#3a3a3a", group: "lang", emphasis: "secondary" },
  { id: "nodejs", name: "Node.js", icon: "/img/icons/nodedotjs.svg", color: "#3C873A", group: "lang", emphasis: "primary" },
  { id: "tailwind", name: "Tailwind CSS", icon: "/img/icons/tailwindcss.svg", color: "#38BDF8", group: "lang", emphasis: "secondary" },
  { id: "sql", name: "SQL", icon: "/img/icons/sql.svg", color: "#4479A1", group: "lang", emphasis: "primary" },

  // Ferramentas
  { id: "git", name: "Git", icon: "/img/icons/git.svg", color: "#F05032", group: "tools" },
  { id: "github", name: "GitHub", icon: "/img/icons/github.svg", color: "#4a4a4a", group: "tools" },
  { id: "vscode", name: "VS Code", icon: "/img/icons/visualstudiocode.svg", color: "#007ACC", group: "tools" },
  { id: "figma", name: "Figma", icon: "/img/icons/figma.svg", color: "#A259FF", group: "tools" },
  { id: "postman", name: "Postman", icon: "/img/icons/postman.svg", color: "#FF6C37", group: "tools" },
  { id: "docker", name: "Docker", icon: "/img/icons/docker.svg", color: "#2496ED", group: "tools" },
  { id: "mysql", name: "MySQL", icon: "/img/icons/mysql.svg", color: "#4479A1", group: "tools", emphasis: "primary" },

  // IA
  { id: "chatgpt", name: "ChatGPT", icon: "/img/icons/openai.svg", color: "#10A37F", group: "ai" },
  { id: "claude", name: "Claude", icon: "/img/icons/claude.svg", color: "#D97757", group: "ai" },
  { id: "gemini", name: "Gemini", icon: "/img/icons/googlegemini.svg", color: "#4285F4", group: "ai" },
  { id: "copilot", name: "GitHub Copilot", icon: "/img/icons/githubcopilot.svg", color: "#4a4a4a", group: "ai" },
  { id: "opencode", name: "OpenCode", icon: "/img/icons/opencode.svg", color: "#2a2a2a", group: "ai" },
];