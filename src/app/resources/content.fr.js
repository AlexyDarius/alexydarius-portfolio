import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Alexy",
  lastName: "Roman",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Ingénieur Systèmes & Logiciels",
  avatar: "/images/avatar.webp",
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
    link: "https://www.linkedin.com/in/alexyromanrfr/",
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
      image: "/images/og/home.webp",
  label: "Accueil",
  title: `Portfolio de ${person.name}`,
  description: `Portfolio présentant mon travail en tant qu'${person.role}.`,
  headline: <>Concevoir des méthodes et outils qui unifient les ingénieurs et boostent la productivité</>,
  featured: {
    display: true,
    title: <>Poste actuel chez <strong className="ml-4">H3 Dynamics</strong></>,
    href: "/about",
  },
  subline: (
    <>
      Je suis Alexy, Ingénieur Systèmes & Logiciels chez <InlineCode>H3 Dynamics</InlineCode>, où je conçois des systèmes piles à combustible hydrogène pour l'aéronautique. Je crée également des méthodes et outils pour aider nos ingénieurs à rester alignés — en unifiant conception, ingénierie système et safety dans un processus collaboratif soutenu par des logiciels que je développe sur mesure pour être adaptés à nos besoins.
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
        Je travaille comme ingénieur pour des systèmes piles à hydrogène de qualité aéronautique
        et développe des logiciels pour optimiser des flux d'ingénierie complexes sous normes strictes, livrant des plateformes fiables et évolutives.
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
          <>Responsable de la planification et de la mise en œuvre de processus d'ingénierie système conformes aux normes aéronautiques (ARP-4754 et ARP-4761).</>,
          <>Conception et amélioration de processus pour aligner les pratiques sur les standards de l'industrie et accélérer les lancements de projets.</>,
          <>Développement d'outils logiciels sur mesure pour soutenir l'ingénierie système : traitement de données de test, APIs, intégrations avec des outils de modélisation.</>,
          <>Création de plateformes logicielles pour les clients du secteur hydrogène, livrant des analyses financières à partir de modèles d'optimisation sur des données techniques et financières en temps-réel.</>,
          <>Pilotage de la transition vers l'Ingénierie Système Basée sur les Modèles (MBSE).</>,
          <>Architecture de systèmes aéronautiques sous norme ARP-4754, avec modélisation et documentation claire pour les parties prenantes.</>,
          <>Travail pratique sur les systèmes à pile à hydrogène : intégration matérielle et mise en service.</>,
          <>Propositions stratégiques pour intégrer des outils IA dans les processus d'ingénierie.</>,
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
        description: (
          <>
            Double diplôme : 
            <br /><strong>- Ingénieur SITA-ISI</strong> (Systèmes d'Information du Transport Aérien)
            <br /><strong>- Master IATSED</strong> (Ingénierie et Conception des Systèmes de Transport Aérien).
            <br />Formation en systèmes aéronautiques, ingénierie aérospatiale et conception logicielle sous normes aéronautiques.
          </>
        ),
      },
    ],
  },
  technical: {
    display: true,
    title: "Compétences Techniques",
    skills: [
      {
        title: "Ingénierie & Architecture de Systèmes Aéronautiques",
        description: <>Conception de systèmes matériels-logiciels sous ARP‑4754/4761, incluant exigences, validation et MBSE.</>,
        images: [],
      },
      {
        title: "MBSE – Ingénierie Système Basée sur les Modèles",
        description: <>Leadership sur l'adoption MBSE : outils de modélisation, standards, et collaboration interdisciplinaire.</>,
        images: [],
      },
      {
        title: "Logiciels pour l'Ingénierie",
        description: <>Outils Python : traitements de données, APIs sur mesure, intégration avec des plateformes de conception et de modélisation.</>,
        images: [],
      },
      {
        title: "Développement Logiciel",
        description: <>Développement full stack (HTML, CSS, JavaScript, TypeScript, React, Next.js), Java, OCaml, C, C++.</>,
        images: [],
      },
      {
        title: "Stratégie IA & Automatisation",
        description: <>Conception et proposition de stratégies pour intégrer l'IA dans les processus d'ingénierie.</>,
        images: [],
      },
      {
        title: "Systèmes Hydrogène & Piles à Combustible",
        description: <>Expérience pratique sur l'architecture, l'intégration, la mise en service et le support opérationnel de systèmes à hydrogène pour l'aéronautique.</>,
        images: [],
      },
      {
        title: "Normes & Conformité Aéronautiques",
        description: <>Maîtrise de ARP‑4754, ARP‑4761 et des meilleures pratiques en sûreté, ingénierie et conception dans l'aéronautique.</>,
        images: [],
      },
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Blog",
  title: "Blog sur l'ingénierie des systèmes et logiciels...",
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

const legal = {
  privacyPolicy: {
    path: "/privacy-policy",
    title: "Politique de confidentialité",
    lastUpdated: "Janvier 2024",
    sections: {
      introduction: {
        title: "1. Introduction",
        content: "Cette politique de confidentialité décrit comment les données personnelles sont collectées, utilisées et protégées lorsque vous visitez alexyroman.com."
      },
      dataController: {
        title: "2. Responsable du traitement",
        content: {
          name: "Alexy Roman",
          email: person.email,
          address: "Toulouse, France"
        }
      },
      dataTypes: {
        title: "3. Types de données collectées",
        items: [
          "Adresse IP",
          "Type et version du navigateur",
          "Pages visitées",
          "Date et heure d'accès",
          "URL de référence",
          "Données du formulaire de contact (le cas échéant)"
        ]
      },
      purpose: {
        title: "4. Finalité et base juridique",
        content: "Vos données sont traitées :",
        items: [
          "Pour les analyses du site web (basé sur votre consentement)",
          "Pour assurer le fonctionnement et la sécurité du site (intérêt légitime)"
        ]
      },
      processors: {
        title: "5. Sous-traitants et tiers",
        content: "Vos données peuvent être traitées par :",
        vercel: {
          name: "Vercel Inc.",
          role: "fournisseur d'hébergement",
          address: "340 S Lemon Ave #4133, Walnut, CA 91789, USA",
          privacy: "https://vercel.com/legal/privacy-policy"
        },
        analytics: "Google Analytics (si vous avez consenti aux cookies analytiques)"
      },
      retention: {
        title: "6. Conservation des données",
        content: "Nous conservons les données personnelles uniquement le temps nécessaire à leur finalité."
      },
      rights: {
        title: "7. Droits des utilisateurs (sous RGPD)",
        content: "Vous avez le droit de :",
        items: [
          "Accéder à vos données",
          "Demander leur correction ou suppression",
          "Limiter ou vous opposer au traitement",
          "Portabilité des données",
          "Déposer une plainte auprès d'une autorité de contrôle"
        ]
      },
      cookies: {
        title: "8. Cookies et suivi",
        content: "Veuillez consulter notre Politique de cookies pour plus de détails."
      },
      security: {
        title: "9. Sécurité",
        content: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données."
      },
      contact: {
        title: "10. Contact",
        content: `Pour toute question relative à la confidentialité, contactez : ${person.email}`
      }
    }
  },
  legalNotice: {
    path: "/legal-notice",
    title: "Mentions légales",
    sections: {
      owner: {
        title: "Propriétaire du site",
        content: person.name
      },
      contact: {
        title: "Contact",
        email: person.email,
        address: "Toulouse, France",
        website: "https://alexyroman.com"
      },
      hosting: {
        title: "Hébergeur",
        name: "Vercel Inc.",
        address: ["340 S Lemon Ave #4133", "Walnut, CA 91789", "USA"],
        website: "https://vercel.com/"
      },
      responsible: {
        title: "Responsable du contenu",
        content: person.name
      },
      disclaimer: {
        content: "Ce site web est un portfolio personnel et ne représente pas une activité commerciale."
      }
    }
  },
  cookiePolicy: {
    path: "/cookie-policy",
    title: "Politique de cookies",
    lastUpdated: "Janvier 2024",
    sections: {
      what: {
        title: "1. Que sont les cookies ?",
        content: "Les cookies sont de petits fichiers texte stockés sur votre appareil pour améliorer la fonctionnalité du site et l'expérience utilisateur."
      },
      types: {
        title: "2. Types de cookies utilisés",
        essential: "Cookies essentiels : Requis pour le fonctionnement de base du site web.",
        analytics: "Cookies analytiques : (Uniquement si consentement) Utilisés pour analyser le trafic et les modèles d'utilisation."
      },
      used: {
        title: "3. Cookies utilisés",
        items: [
          { name: "cookie-consent", purpose: "Stocke vos préférences de cookies" },
          { name: "language", purpose: "Mémorise votre préférence de langue" },
          { name: "theme", purpose: "Mémorise votre préférence de mode sombre/clair" },
          { name: "Cookies Google Analytics", purpose: "(Uniquement si les cookies analytiques sont activés)" }
        ]
      },
      thirdParty: {
        title: "4. Cookies tiers",
        content: "Les services tiers (ex : Google Analytics) peuvent placer des cookies si vous avez consenti aux cookies analytiques."
      },
      duration: {
        title: "5. Durée des cookies",
        session: "Cookies de session : Expirent à la fermeture du navigateur",
        persistent: "Cookies persistants : Expirent après une durée définie (notre consentement expire après 30 jours)"
      },
      managing: {
        title: "6. Gestion des cookies",
        content: "Vous pouvez gérer ou supprimer les cookies dans les paramètres de votre navigateur. Vous pouvez également modifier vos préférences via notre bannière de cookies lorsqu'elle apparaît, ou en effaçant les données de votre navigateur pour réinitialiser vos choix."
      },
      consent: {
        title: "7. Consentement",
        content: "Les cookies non essentiels ne sont utilisés que si vous avez donné votre consentement explicite via notre bannière de cookies. Les cookies essentiels sont toujours actifs car ils sont nécessaires au bon fonctionnement du site web."
      },
      contact: {
        title: "8. Contact",
        content: `Si vous avez des questions sur notre politique de cookies, contactez : ${person.email}`
      }
    }
  }
};

export { person, social, newsletter, home, about, blog, work, gallery, legal };
