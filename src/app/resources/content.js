import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Alexy",
  lastName: "Roman",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Systems & Software Engineer",
  avatar: "/images/avatar.webp",
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
    link: "https://www.linkedin.com/in/alexyromanrfr/",
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
      image: "/images/og/home.webp",
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
      I'm Alexy, a Systems & Software Engineer at <InlineCode>H3 Dynamics</InlineCode>, where I design aeronautical-grade hydrogen fuel cells systems. I also create methods and tools that help our engineers stay connected and aligned — bringing together design, systems engineering, and safety into a shared, collaborative workflow, supported by custom software I craft to fit our specific needs.
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

const legal = {
  privacyPolicy: {
    path: "/privacy-policy",
    title: "Privacy Policy",
    lastUpdated: "January 2024",
    sections: {
      introduction: {
        title: "1. Introduction",
        content: "This privacy policy describes how personal data is collected, used, and protected when you visit alexyroman.com."
      },
      dataController: {
        title: "2. Data Controller",
        content: {
          name: "Alexy Roman",
          email: person.email,
          address: "Toulouse, France"
        }
      },
      dataTypes: {
        title: "3. Types of Data Collected",
        items: [
          "IP address",
          "Browser type and version", 
          "Pages visited",
          "Date and time of access",
          "Referrer URL",
          "Contact form data (if applicable)"
        ]
      },
      purpose: {
        title: "4. Purpose and Legal Basis",
        content: "Your data is processed:",
        items: [
          "For website analytics (based on your consent)",
          "To ensure website functionality and security (legitimate interest)"
        ]
      },
      processors: {
        title: "5. Data Processors and Third Parties",
        content: "Your data may be processed by:",
        vercel: {
          name: "Vercel Inc.",
          role: "hosting provider",
          address: "340 S Lemon Ave #4133, Walnut, CA 91789, USA",
          privacy: "https://vercel.com/legal/privacy-policy"
        },
        analytics: "Google Analytics (if consented to analytics cookies)"
      },
      retention: {
        title: "6. Data Retention",
        content: "We keep personal data only as long as necessary for its intended purpose."
      },
      rights: {
        title: "7. User Rights (under GDPR)",
        content: "You have the right to:",
        items: [
          "Access your data",
          "Request correction or deletion",
          "Restrict or object to processing", 
          "Data portability",
          "Lodge a complaint with a supervisory authority"
        ]
      },
      cookies: {
        title: "8. Cookies and Tracking",
        content: "Please refer to our Cookie Policy for details."
      },
      security: {
        title: "9. Security", 
        content: "We implement appropriate technical and organizational measures to protect your data."
      },
      contact: {
        title: "10. Contact",
        content: `For any privacy-related questions, contact: ${person.email}`
      }
    }
  },
  legalNotice: {
    path: "/legal-notice",
    title: "Legal Notice / Impressum",
    sections: {
      owner: {
        title: "Website Owner",
        content: person.name
      },
      contact: {
        title: "Contact",
        email: person.email,
        address: "Toulouse, France",
        website: "https://alexyroman.com"
      },
      hosting: {
        title: "Hosting Provider",
        name: "Vercel Inc.",
        address: ["340 S Lemon Ave #4133", "Walnut, CA 91789", "USA"],
        website: "https://vercel.com/"
      },
      responsible: {
        title: "Responsible for Content",
        content: person.name
      },
      disclaimer: {
        content: "This website is a personal portfolio and does not represent a commercial activity."
      }
    }
  },
  cookiePolicy: {
    path: "/cookie-policy", 
    title: "Cookie Policy",
    lastUpdated: "January 2024",
    sections: {
      what: {
        title: "1. What Are Cookies?",
        content: "Cookies are small text files stored on your device to enhance site functionality and user experience."
      },
      types: {
        title: "2. Types of Cookies We Use",
        essential: "Essential Cookies: Required for the basic operation of the website.",
        analytics: "Analytics Cookies: (Only if consented) Used to analyze traffic and usage patterns."
      },
      used: {
        title: "3. Cookies Used",
        items: [
          { name: "cookie-consent", purpose: "Stores your cookie preferences" },
          { name: "language", purpose: "Remembers your language preference" },
          { name: "theme", purpose: "Remembers your dark/light mode preference" },
          { name: "Google Analytics cookies", purpose: "(Only if analytics cookies are enabled)" }
        ]
      },
      thirdParty: {
        title: "4. Third-Party Cookies",
        content: "Third-party services (e.g., Google Analytics) may place cookies if you have consented to analytics cookies."
      },
      duration: {
        title: "5. Cookie Duration",
        session: "Session cookies: Expire when browser is closed",
        persistent: "Persistent cookies: Expire after a set time (our consent expires after 30 days)"
      },
      managing: {
        title: "6. Managing Cookies",
        content: "You can manage or delete cookies in your browser settings. You can also change your preferences using our cookie banner when it appears, or by clearing your browser data to reset your choices."
      },
      consent: {
        title: "7. Consent",
        content: "Non-essential cookies are only used if you have given explicit consent via our cookie banner. Essential cookies are always active as they are necessary for the website to function properly."
      },
      contact: {
        title: "8. Contact",
        content: `If you have any questions about our cookie policy, contact: ${person.email}`
      }
    }
  }
};

export { person, social, newsletter, home, about, blog, work, gallery, legal };
