export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  featured: boolean;
  size: "lg" | "md" | "sm";
}

export const projects: Project[] = [
  {
    id: "business-os",
    title: "Business OS",
    description:
      "Meu primeiro projeto com banco de dados. Plataforma modular de gestão de negócios com dashboard, clientes, orçamentos e CRM. Foi aqui que aprendi na prática a modelar dados com Prisma, criar autenticação e fazer deploy. Cada erro e cada correção virou aprendizado — é o projeto que mais me ensinou na minha jornada.",
    image: "/img/bussineos.png",
    tags: ["JavaScript", "Node.js", "Prisma", "Neon"],
    link: "https://businessos-production-4c56.up.railway.app",
    featured: true,
    size: "lg",
  },
  {
    id: "catalogo-filmes",
    title: "Catálogo de Filmes",
    description:
      "Meu primeiro projeto consumindo API REST. Aplicação web para explorar filmes e séries com filtros, busca e detalhes. Foi onde aprendi a fazer requisições HTTP, tratar respostas assíncronas e montar a interface com dados reais — um passo importante no meu processo de aprendizado.",
    image: "/img/catalogo-de-filme.png",
    tags: ["HTML", "CSS", "JavaScript", "API"],
    link: "https://filipelucas-fsa.github.io/catalogo-de-filmes/",
    featured: true,
    size: "md",
  },
  {
    id: "resident-evil-village",
    title: "Resident Evil Village",
    description: "Site temático inspirado no jogo Resident Evil Village, com animações e design imersivo.",
    image: "/img/card-resident-evill-village.png",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://filipelucas-fsa.github.io/resident-evil-village/",
    featured: true,
    size: "md",
  },
  {
    id: "lumina",
    title: "Lumina — Clínica Odontológica",
    description: "Site premium para clínica odontológica, com agendamento online e painel administrativo.",
    image: "/img/card-lumina.png",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://lumina-gules-mu.vercel.app",
    featured: false,
    size: "sm",
  },
  {
    id: "spartan-gym",
    title: "Spartan Gym",
    description: "Landing page para academia com design impactante e identidade visual forte.",
    image: "/img/spartan-gym.png",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://academia-spartan-gym.vercel.app",
    featured: false,
    size: "sm",
  },
  {
    id: "confeitaria",
    title: "Confeitaria Maiza Borges",
    description: "Site institucional para confeitaria artesanal, com identidade visual acolhedora.",
    image: "/img/card-confeitaria.png",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://filipelucas-fsa.github.io/Maizaconfeitaria/",
    featured: false,
    size: "sm",
  },
  {
    id: "stranger-things",
    title: "Stranger Things",
    description: "Projeto temático inspirado na estética da série, com atmosfera anos 80.",
    image: "/img/card-stranger-thigs.png",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://filipelucas-fsa.github.io/stranger-things/",
    featured: false,
    size: "sm",
  },
  {
    id: "restaurante-brasa",
    title: "Restaurante Brasa",
    description: "Landing page moderna para restaurante, com navegação fluida e experiência imersiva.",
    image: "/img/hero-restaurante.png",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://filipelucas-fsa.github.io/restaurante-brasa/",
    featured: false,
    size: "sm",
  },
];
