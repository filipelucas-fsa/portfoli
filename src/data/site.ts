export const site = {
  name: "Filipe Lucas",
  firstName: "Filipe",
  lastName: "Lucas",
  initials: "FL",
  role: "Desenvolvedor Front-end & Full Stack",
  location: "Feira de Santana, BA - Brasil",
  status: "Estudante de ADS",
  availability: "Disponível para oportunidades",
  heroDescription: "Transformando ideias em soluções reais.",
  about: [
    "Sou estudante de Análise e Desenvolvimento de Sistemas com foco em desenvolvimento web. Gosto de transformar problemas em soluções criativas, escrevendo código limpo, escalável e eficiente.",
    "Tenho experiência com desenvolvimento front-end e também atuo com back-end e bancos de dados. Construo sites e sistemas sob medida para pequenos negócios que precisam se destacar e converter visitantes em clientes.",
    "Do conceito à entrega, cada projeto recebe atenção individual — sem templates prontos, sem soluções genéricas.",
  ],
  stats: [
    { value: 2, suffix: "+", label: "Anos estudando e praticando código" },
    { value: 10, suffix: "+", label: "Projetos desenvolvidos" },
    { value: 117, suffix: "+", label: "Commits no GitHub" },
    { value: 0, suffix: "", label: "Apaixonado por tecnologia", staticText: "24/7" },
  ],
  education: {
    label: "Formação",
    title: "Técnico em Análise e Desenvolvimento de Sistemas",
    place: "UniCesumar",
    date: "2025 — 2027 (Em andamento)",
  },
  experience: {
    label: "Experiência",
    title: "Freelancer — Desenvolvedor Front-end & Full Stack",
    place: "Projetos independentes para pequenos e médios negócios",
    date: "Desenvolvimento de sites, landing pages e sistemas web completos, com foco em performance, design autoral e conversão.",
  },
  social: {
    github: "https://github.com/filipelucas-fsa",
    linkedin: "https://www.linkedin.com/in/filipe-oliveira-b3a883312/",
    whatsapp: "https://wa.me/5575998639951",
    email: "mailto:filipelucasfsa@gmail.com",
  },
  contact: {
    eyebrow: "VAMOS CONVERSAR?",
    title: "Tem um projeto em mente?",
    description: "Estou sempre aberto a novos desafios e oportunidades. Vamos criar algo incrível juntos!",
  },
};

export type Stat = (typeof site.stats)[number];
