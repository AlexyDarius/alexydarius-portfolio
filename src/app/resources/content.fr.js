import { Logo } from "@/once-ui/components";

const person = {
  firstName: "Alexy",
  lastName: "Roman",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Ingénieur Systèmes & Logiciels",
  avatar: "/images/avatar.png",
  email: "contact@alexyroman.com",
  location: "Europe/Paris",
  languages: ["English", "Français"],
};

const newsletter = {
  display: false,
  title: <>Abonnez-vous à la newsletter de {person.firstName}</>,
  description: (
    <>
      J'écris occasionnellement sur l'ingénierie des systèmes, l'intégration logicielle et la convergence
      des systèmes complexes avec du code évolutif.
    </>
  ),
};

const social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/AlexyDarius",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/alexyroman31000/",
  },
  {
    name: "X",
    icon: "x",
    link: "",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Accueil",
  title: `Portfolio de ${person.name}`,
  description: `Portfolio présentant mon travail en tant qu'${person.role}.`,
  headline: <>Créer des ponts entre les systèmes matériels et les solutions logicielles</>,
  featured: {
    display: true,
    title: <>Poste actuel chez <strong className="ml-4">H3 Dynamics</strong></>,
    href: "/about",
  },
  subline: (
    <>
      Je suis Alexy, Ingénieur Systèmes & Logiciels chez H3 Dynamics, concevant des architectures
      système robustes et évolutives.<br /> En dehors du travail, je développe des projets personnels
      à l'intersection du matériel et du logiciel.
    </>
  ),
};

const about = {
  path: "/about",
  label: "À propos",
  title: `À propos – ${person.name}`,
  description: `Découvrez ${person.name}, ${person.role} basé à Toulouse.`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Je suis un Ingénieur Systèmes & Logiciels basé à Toulouse, travaillant chez H3 Dynamics.
        Je combine l'ingénierie des systèmes matériels et le développement logiciel pour optimiser
        les flux de travail complexes et fournir des plateformes fiables et évolutives.
      </>
    ),
  },
  work: {
    display: true,
    title: "Expérience Professionnelle",
    experiences: [
      {
        company: "H3 Dynamics",
        timeframe: "2024 – Présent",
        role: "Ingénieur Systèmes & Logiciels",
        achievements: [
          <>Développement et optimisation des processus d'ingénierie système conformes aux normes de l'industrie.</>,
          <>Intégration de modules logiciels pour rationaliser les flux de travail et améliorer la fiabilité.</>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Formation",
    institutions: [
      {
        name: "École Nationale de l'Aviation Civile (ENAC)",
        description: <>Formation en systèmes aéronautiques et ingénierie aérospatiale.</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Compétences Techniques",
    skills: [
      {
        title: "Ingénierie Système",
        description: <>Architecture de flux de travail matériel-logiciel complexes, exigences et validation.</>,
        images: [],
      },
      {
        title: "Développement Logiciel",
        description: <>Création d'applications Python et full stack pour soutenir l'ingénierie système.</>,
        images: [],
      },
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Blog",
  title: "Écrits sur l'ingénierie des systèmes et logiciels...",
  description: `Découvrez les dernières explorations de ${person.name}`,
};

const work = {
  path: "/work",
  label: "Projets",
  title: `Projets – ${person.name}`,
  description: `Projets systèmes et logiciels par ${person.name}`,
};

const gallery = {
  path: "/gallery",
  label: "Galerie",
  title: `Galerie photo – ${person.name}`,
  description: `Une collection de photos par ${person.name}`,
  images: [],
};

export { person, social, newsletter, home, about, blog, work, gallery }; 