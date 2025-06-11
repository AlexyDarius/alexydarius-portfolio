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
      I’m Alexy, a Systems & Software Engineer at <InlineCode>H3 Dynamics</InlineCode>, where I design aeronautical-grade hydrogen fuel cells systems. I also create methods and tools that help our engineers stay connected and aligned — bringing together design, systems engineering, and safety into a shared, collaborative workflow, supported by custom software I craft to fit our specific needs.
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
        hardware systems engineering for aeronautical-grade fuel cells and software development to optimize complex engineering workflow under stringant industry standards, delievring reliable and scalable platforms.
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
          <>Leading the planning and implementation of systems engineering workflows in compliance with aeronautical standards (ARP-4754 and ARP-4761).</>,
          <>Designing and refining engineering processes to align with industry standards, streamline project launches, and provide reusable support materials and building blocks.</>,
          <>Developing custom software tools to support systems engineering — such as test data processors and APIs that integrate with widely used design and modeling tools.</>,
          <>Building software platforms for hydrogen-sector clients, delivering financial insights through technical expertise and optimisatioon models.</>,
          <>Driving the organization-wide transition to Model-Based Systems Engineering (MBSE).</>,
          <>Architecting aeronautical-grade systems under ARP-4754 using MBSE to ensure clear communication with all stakeholders.</>,
          <>Hands-on work with fuel cell systems, including hardware integration and commissioning in an operational role.</>,
          <>Developing and pitching strategic initiatives for integrating AI tools to enhance engineering processes and decision-making.</>,
        ],
        images: [],
      }   
      // Add prior roles if desired
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "French National School of Civil Aviation (ENAC)",
        description: <>
        Double degree: 
        <br></br> <strong>-SITA-ISI Engineer</strong> (Information Systems for Air transport)<br></br> <strong>-IATSED Master</strong> (International Air Transport System Engineering and Design).
        <br></br> Studied aviation systems, aerospace engineering, and system design for the air transport sector with a focus on software engineering udner aeronautical standards.
      </>,
      },
      // Add additional studies if relevant
    ],
  },
  technical: {
    display: true,
    title: "Technical Skills & Competencies",
    skills: [
      {
        title: "Aeronautical Systems Engineering & Architecture",
        description: <>Designing aeronautical-grade hardware-software systems under ARP‑4754/4761, with requirements, validation, and MBSE.</>,
        images: [],
      },
      {
        title: "Model‑Based Systems Engineering (MBSE)",
        description: <>Leading MBSE adoption, using modeling tools and standards to align engineering teams and streamline complex workflows.</>,
        images: [],
      },
      {
        title: "Custom Engineering Software",
        description: <>Developing Python-based tools: data processors, custom APIs, integrations with design/modeling platforms, and internal engineering platforms.</>,
        images: [],
      },
      {
        title: "Software Development",
        description: <>Full-stack web development (HTML, CSS, JavaScript, TypeScript, React, Next.js), Java, OCaml, C, and C++.</>,
        images: [],
      },
      {
        title: "AI & Automation Strategy",
        description: <>Designing and pitching AI integration strategies to improve engineering efficiency and decision-making.</>,
        images: [],
      },
      {
        title: "Hydrogen & Fuel‑Cell Systems",
        description: <>Hands-on experience in hydrogen hardware architecture, design, integration, commissioning, and operational support of aeronautical-grade fuel cell systems.</>,
        images: [],
      },
      {
        title: "Aeronautical Engineering Standards & Compliance",
        description: <>Expertise in ARP‑4754, ARP‑4761, and best practices for safety, systems, and design in aerospace engineering.</>,
        images: [],
      },
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
