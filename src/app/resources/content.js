import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Alexy",
  lastName: "Roman",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Systems & Software Engineer",
  avatar: "/images/avatar.png",
  email: "contact@alexyroman.com",
  location: "Europe/Paris", // IANA time zone identifier
  languages: ["English", "Français"],
};

const newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I occasionally write about systems engineering, software integration, and the convergence of
      complex systems with scalable code.
    </>
  ),
};

const social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/AlexyDarius", // add your GitHub link
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/alexyroman31000/",
  },
  {
    name: "X",
    icon: "x",
    link: "", // add your X/Twitter link if any
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
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio showcasing my work as a ${person.role}.`,
  headline: <>Designing methods and tools that unite engineers and boost productivity</>,
  featured: {
    display: true,
    title: <>Current role at <strong className="ml-4">H3 Dynamics</strong></>,
    href: "/about",
  },
  subline: (
    <>
      I’m Alexy, a Systems & Software Engineer at <InlineCode>H3 Dynamics</InlineCode>, where I design aeronautical-grade systems for hydrogen fuel cells. I also create methods and tools that help our engineers stay connected and aligned — bringing together design, systems engineering, and safety into a shared, collaborative workflow, supported by custom software I craft to fit our specific needs.
    </>
  ),
};

const about = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} based in Toulouse/Europe.`,
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
        I am a Toulouse-based Systems & Software Engineer at H3 Dynamics, blending
        hardware systems engineering and software development to optimize complex workflows
        and deliver reliable, scalable platforms.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "H3 Dynamics",
        timeframe: "2024 – Present",
        role: "Systems & Software Engineer",
        achievements: [
          <>Develop and optimize systems engineering processes to align with industry standards.</>,
          <>Integrate software modules to streamline system workflows and enhance reliability.</>,
        ],
        images: [],
      },
      // Add prior roles if desired
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "École Nationale de l’Aviation Civile (ENAC)",
        description: <>Studied aviation systems and aerospace engineering.</>,
      },
      // Add additional studies if relevant
    ],
  },
  technical: {
    display: true,
    title: "Technical Skills",
    skills: [
      {
        title: "Systems Engineering",
        description: <>Architecting complex hardware–software workflows, requirements & validation.</>,
        images: [],
      },
      {
        title: "Software Development",
        description: <>Building Python and full stack applciations to support systems engineering.</>,
        images: [],
      },
      // Add more skills as needed
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about systems & software engineering…",
  description: `Read what ${person.name} has been exploring lately`,
};

const work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Systems & software projects by ${person.name}`,
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [
    // Placeholder or your own images
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
