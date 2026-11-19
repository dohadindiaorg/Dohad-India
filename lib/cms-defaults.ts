export interface FAQItemData {
  question: string;
  answer?: string;
  hasLink?: boolean;
  linkText?: string;
  linkUrl?: string;
  hasTable?: boolean;
  tableData?: Array<{ category: string; fee: string }>;
  tableFooter?: string;
  order?: number;
}

export const DEFAULT_FAQS: FAQItemData[] = [
  {
    question: "What is DOHaD and why is it important?",
    answer:
      "The Developmental Origins of Health and Disease (DOHaD) paradigm focuses on how early-life exposures, including during preconception and pregnancy, impact long-term health. The DOHaD India Regional Society is dedicated to advancing this science and creating evidence-based policies and practices, particularly within the Indian context.",
  },
  {
    question: "What is the mission of DOHaD India?",
    answer:
      "DOHaD India aims to promote and coordinate research on the Developmental Origins of Health and Disease, while building the capacity of professionals through research, communication, and advocacy. Its mission is to catalyze collaborative research, capacity building, knowledge dissemination, and policy engagement rooted in the Indian context.",
  },
  {
    question: "Who can become a member of DOHaD India?",
    answer:
      "Membership is open to anyone interested in DOHaD research, policy, and practice in India and the South Asian region. To become a member of DOHaD India, individuals must first join the International DOHaD Society and select DOHaD India as their Regional Society.",
  },
  {
    question: "What are the benefits of becoming a member?",
    answer:
      "Becoming a member of DOHaD India gives you access to the Journal of Developmental Origins of Health and Disease, newsletters, and other resources. You can register for workshops and conferences organized by international or regional DOHaD societies at a reduced cost. You also get opportunities for training, capacity building, and career advancement, as well as the chance to network and collaborate with researchers in India and internationally.",
  },
  {
    question: "How do I become a member?",
    hasLink: true,
    linkText: "International DOHaD Society",
    linkUrl: "https://dohadsoc.org/join-us/",
    answer:
      "International Society membership fees are separate and remain payable according to the member's applicable membership category.",
  },
  {
    question: "How much does a membership cost?",
    answer: "",
    hasTable: true,
    tableData: [
      { category: "Standard (for established researchers)", fee: "Rs 1,000" },
      {
        category: "Training / early career researchers (within 5 years of PhD)",
        fee: "Rs 500",
      },
      { category: "Masters and undergraduate students", fee: "Rs 250" },
    ],
    tableFooter:
      "The DOHaD India annual fee supports our website maintenance and contributes towards other activities undertaken by the DOHaD India Regional Society. Eligibility for reduced International Society LMIC/MIC membership rates is determined by the member's country of residence and work, in accordance with International Society membership policies.",
  },
];

export interface MembershipTier {
  name: string;
  fee: string;
  period: string;
  order?: number;
}

export interface MembershipPageData {
  hero: {
    title: string;
    description: string;
  };
  whoCanJoin: {
    title: string;
    content: string;
  };
  tiers: MembershipTier[];
  tierNotes: {
    note1: string;
    note2: string;
  };
  howToJoin: {
    title: string;
    description1: string;
    description2: string;
    buttonText: string;
    buttonLink: string;
  };
}

export const DEFAULT_MEMBERSHIP_PAGE: MembershipPageData = {
  hero: {
    title: "Join Our Community & Advance DOHaD Research",
    description:
      "Be part of India's leading network of researchers and professionals working on the developmental origins of health and disease. Collaborate, learn, and grow with us.",
  },
  whoCanJoin: {
    title: "Who Can Become a Member?",
    content:
      "Membership is open to anyone interested in DOHaD research, policy, and practice. This includes researchers, clinicians, policymakers, students, and professionals from related fields.",
  },
  tiers: [
    {
      name: "Undergraduate Students",
      fee: "₹250",
      period: "Annual Fee",
      order: 0,
    },
    {
      name: "Early Career Researchers",
      fee: "₹500",
      period: "Annual Fee",
      order: 1,
    },
    {
      name: "Standard Regular Members",
      fee: "₹1000",
      period: "Annual Fee",
      order: 2,
    },
  ],
  tierNotes: {
    note1:
      "The DOHaD India annual fee supports our website maintenance and contributes towards other activities undertaken by the DOHaD India Regional Society.",
    note2:
      "Eligibility for reduced International Society LMIC/MIC membership rates is determined by the member's country of residence and work, in accordance with International Society membership policies.",
  },
  howToJoin: {
    title: "How to Become a Member",
    description1:
      "Join the DOHaD India community and help advance research, collaboration, and awareness across the region.",
    description2:
      "International Society membership fees are separate and remain payable according to the member's applicable membership category.",
    buttonText: "Go to Registration",
    buttonLink: "https://dohadsoc.org/join-us/",
  },
};

export interface ResearchPillarItem {
  title: string;
  description: string;
  icon?: string;
  order?: number;
}

export interface ResearchFocusData {
  title: string;
  subtitle: string;
  pillars: ResearchPillarItem[];
}

export const DEFAULT_RESEARCH_FOCUS: ResearchFocusData = {
  title: "Research Focus Areas",
  subtitle:
    "Our research spans multiple disciplines to understand how early-life exposures affect long-term health outcomes in Indian populations",
  pillars: [
    {
      title: "Adolescent & Maternal Health",
      description:
        "Comprehensive research on maternal nutrition, prenatal care, and adolescent health factors that influence lifelong wellbeing and disease risk.",
      icon: "Baby",
      order: 0,
    },
    {
      title: "Early Childhood",
      description:
        "Investigating critical early childhood development factors and their impact on physical and cognitive health outcomes throughout life.",
      icon: "Blocks",
      order: 1,
    },
    {
      title: "Lifecourse Research",
      description:
        "Longitudinal studies tracking health trajectories from conception through adulthood to understand cumulative life experiences.",
      icon: "TrendingUp",
      order: 2,
    },
    {
      title: "Multiomics Research",
      description:
        "Advanced molecular analysis integrating genomics, proteomics, and metabolomics to understand disease mechanisms at multiple biological levels.",
      icon: "Dna",
      order: 3,
    },
    {
      title: "Nutrition & Lifestyle",
      description:
        "Research on dietary patterns, lifestyle factors, and their role in modulating developmental programming and long-term health outcomes.",
      icon: "Apple",
      order: 4,
    },
    {
      title: "Health Policy Research",
      description:
        "Evidence-based policy research to translate scientific findings into actionable health policies and interventions for population health.",
      icon: "FileText",
      order: 5,
    },
  ],
};

export interface NarrativeCardItem {
  title: string;
  description: string;
  icon?: string;
}

export interface SpecialNarrativesData {
  capacityBuilding: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    items: NarrativeCardItem[];
  };
  advocacy: {
    title: string;
    subtitle: string;
    items: NarrativeCardItem[];
  };
  communication: {
    title: string;
    subtitle: string;
    webinarsTitle: string;
    webinarsDescription: string;
    webinarsBullets: string[];
    followUsTitle: string;
    followUsDescription: string;
  };
}

export const DEFAULT_NARRATIVES: SpecialNarrativesData = {
  capacityBuilding: {
    title: "Capacity Building",
    subtitle:
      "We support the next generation of DOHaD researchers through structured training and hands-on experience.",
    buttonText: "View Upcoming Events & Workshops",
    buttonLink: "/events",
    items: [
      {
        title: "Training Workshops",
        description:
          "Hands-on sessions covering lifecourse epidemiology, research methodologies, and specialized DOHaD study designs.",
        icon: "GraduationCap",
      },
      {
        title: "Mentorship Programs",
        description:
          "Connecting early-career researchers with senior DOHaD scientists to foster professional growth and collaboration.",
        icon: "Users",
      },
      {
        title: "Writing Workshops",
        description:
          "Structured sessions to strengthen scientific writing, grant applications, and publication skills for DOHaD researchers.",
        icon: "FileText",
      },
      {
        title: "Internship Programs",
        description:
          "Providing students and early-career professionals with hands-on research experience within DOHaD India's network.",
        icon: "Briefcase",
      },
    ],
  },
  advocacy: {
    title: "National Impact through Engagement",
    subtitle:
      "We bridge the gap between scientific discovery and public health action, collaborating with stakeholders across India to ensure early-life health is a national priority.",
    items: [
      {
        title: "Policy & Practice",
        description:
          "Translating evidence into clinical guidelines, policies and programs that make a real-world impact on maternal and child health outcomes.",
        icon: "FileHeart",
      },
      {
        title: "Government Partnerships",
        description:
          "Collaborating with central and state governments to promote adolescent health, maternal-child health, and NCD prevention policies and programs.",
        icon: "Handshake",
      },
      {
        title: "Global Representation",
        description:
          "Representing India's voice in global DOHaD policy dialogues and initiatives, bringing local insights to international platforms.",
        icon: "Globe",
      },
      {
        title: "Public Awareness",
        description:
          "Raising awareness about how early-life environments shape lifelong health, empowering communities with evidence-based knowledge.",
        icon: "Megaphone",
      },
    ],
  },
  communication: {
    title: "Communication & Outreach",
    subtitle:
      "We actively promote and disseminate DOHaD research across India and globally through multiple communication platforms",
    webinarsTitle: "Webinars & Events",
    webinarsDescription:
      "Regular webinars featuring renowned Indian and international experts to share emerging insights from DOHaD research.",
    webinarsBullets: [
      "Expert talks on emerging DOHaD research",
      "Methods workshops for practical skills",
      "Policy roundtables for collaborative discussions",
    ],
    followUsTitle: "Follow Us",
    followUsDescription:
      "Stay updated with carefully curated insights on recent publications, events, funding opportunities, and valuable member contributions.",
  },
};


export interface LegalSection {
  id: string;
  title: string;
  content: string;
}

export interface LegalDocument {
  title: string;
  lastUpdated?: string;
  sections: LegalSection[];
}

export interface LegalPagesSettings {
  privacyPolicy: LegalDocument;
  termsOfService: LegalDocument;
}

export const DEFAULT_LEGAL_PAGES: LegalPagesSettings = {
  privacyPolicy: {
    title: "Privacy Policy",
    lastUpdated: "12 April 2022",
    sections: [
      {
        id: "privacy-intro",
        title: "Introduction",
        content:
          "This website privacy policy describes how the Developmental Origins of Health and Disease (DOHaD) India regional society protects and makes use of the information that you may provide to us when you use this website and/or when you sign-up to become a member whether as an individual or on behalf of an organisation. If you are asked to provide information when using this website, it will only be used in the ways described in this privacy policy.\n\nWe collect and process your personal data in accordance with applicable laws that regulate data protection and privacy. This includes, but is not limited to, the Data Protection Act 1998, Privacy and Electronic Communications Regulations 2003 and, from 25 May 2018, the EU General Data Protection Regulation (2016/679) as well as the UK Data Protection Act coming into force at the same time (as these may be amended or replaced from time to time) (together 'Data Protection Law').\n\nWe may update or amend this website privacy policy from time to time and will notify you if there are any changes.",
      },
      {
        id: "privacy-contact",
        title: "Contact details",
        content:
          "If you have any questions about this policy, what information we hold about you and how it is used, or want to exercise any of your rights under Data Protection Law (see below) please email contact@dohadindia.org",
      },
      {
        id: "privacy-how-we-use",
        title: "How we use your data",
        content:
          "DOHaD India regional society collects information obtained from individuals through this website or when they subscribe for membership administration/management and the other purposes set out below.\n\nThe information we hold is generally an individual contact name, member organisation (if applicable), contact information (e.g., postal address, email and phone number) and subscription details of the relevant individual professional member or organisation. You may also be provided with login details to access the secure member area of our website, which you should keep secure and not share with anyone else. Such information that relates to you as an identifiable individual is called 'personal data'.\n\nSpecifically, we may use such personal data we collect about you for the following purposes:\n- To maintain our own internal membership records.\n- To contact you in response to a specific enquiry or request that you may make.\n- To inform and update you of relevant meetings, working groups, consultation exercises and events that the Society may be arranging or participating in.\n- To send you periodically the Society Newsletter to which you have subscribed.\n- To communicate with you about your membership subscription.\n\nIn addition to communication via the website, the regional society may contact you in writing by e-mail and by telephone for the above purposes.\n\nWe will not pass your personal data to any third party (such as an external public authority or commercial organisation) except where we have asked (for example, for completion of a survey) and you have opted out or we are subject to a legal obligation to comply.\n\nOccasionally your email address may be visible to other users if you are part of a working group where interaction via e-mail is encouraged.\n\nUnder Data Protection Law, the Society gathers and processes personal data about individual Members and contacts on the legal basis of it being necessary for us to do so in order to fulfil our obligations to our Membership and/or in the legitimate interests of the Society being able to conduct membership administration and act effectively as a representative body.",
      },
      {
        id: "privacy-links-security",
        title: "Links from our side and security",
        content:
          "The regional society website may contain links to third party websites. Please note that these are provided for information only, and we have no control over websites outside the https://dohadsoc.org/ domain. If you view or provide information to a website to which we link, we are not responsible for its data protection and privacy practices and you should always check the privacy policies on that third-party site for information about how your personal data is handled.\n\nWhile we use appropriate measures to keep data secure from unauthorised or unlawful access, please be aware that there are always inherent risks in sending data over public networks and we cannot 100% guarantee the security of all personal data disclosed or transmitted to us.",
      },
      {
        id: "privacy-retention",
        title: "Data retention",
        content:
          "We retain personal data about you for as long as you are a subscribing regional society member. Where your individual Membership ceases. We will remove your contact details from our Membership records within a reasonable period (normally up to 28 days). In some exceptional cases, we may retain your details for a period of up to 6 years, so long as retaining your details is reasonably needed for the purpose of establishing, exercising, or defending our legal rights.",
      },
      {
        id: "privacy-rights",
        title: "Your data rights",
        content:
          "In accordance with your rights under Data Protection Law, you can request information about the personal data that we hold about you, what we use that personal data for and to whom it may be disclosed to (if relevant). Where applicable, you can also request that we:\n- correct personal data that we hold about you which is inaccurate or incomplete;\n- no longer use your personal data for direct marketing purposes, such as sending you newsletters or other information promoting the Society's objectives (if relevant);\n- erase your personal data if it is no longer needed by us; or\n- restrict the processing of your personal data in certain circumstances, for example if you do not think that we have the right to process that data or you need the data to exercise a legal claim.\n\nIf you would like to exercise any of the above rights, please get in touch with us using the 'Contact details' section above. We may require further information to verify your identity before we can respond. Please note that we may not be able to rectify or erase your data where we are required to process or retain your personal data for a lawful purpose in accordance with Data Protection Law.\n\nIf you believe we are processing your personal data other than in accordance with Data Protection Law and you are not satisfied with our response to a request, you may have a right to complain to the UK Information Commissioner's Office (ICO). For more information see: https://ico.org.uk/.",
      },
      {
        id: "privacy-cookies",
        title: "Cookie Policy",
        content:
          "Our website uses cookies. A cookie is a small text file which is stored on your computer, tablet or phone when you visit a website. These cookies allow us to distinguish you from other users of our website. This helps us to provide you with a more personalised experience when you browse our website, allows us to monitor website use and helps us identify how we can improve our website.\n\nThere are two main types of cookie:\n- session cookies—these are deleted when you finish browsing a website and are not stored on your computer longer than this\n- persistent cookies—these are stored on your computer after you have finished using a website so that the website provider can remember your preferences the next time you use it\n\nCookies can be set by the website you have browsed, i.e., the website displayed in the uniform resource locator (URL) window. These are called first party cookies. Third party cookies are set by a website other than the one you are browsing.\n\nWhy do we use cookies?\nWe use cookies to collect the following information:\n- Technical information including the internet protocol (IP) address used to connect your computer to the internet; your site login information; the browser and version of the browser that you are using, the time zone setting, browser plug-in types and versions; your operating system.\n- Information about your visit to our website including the websites you visited before and after ours; products, services or other terms you searched for; page response times, download errors, length of visits to certain pages; page interaction information (such as scrolling, clicks, mouse-overs), and methods used to browse away from the page.\n\nConsent:\nIf you continue to use our website, we will assume that you are happy to receive all cookies from our website. However, if you would prefer to change your cookie settings, you can do so at any time—see below 'Controlling our use of cookies'.\n\nControlling our use of cookies:\nMost browsers automatically accept cookies unless you change your internet browser settings. If you wish to restrict, block or delete the cookies which are set by any websites, you can generally do this through your browser settings. These settings are usually found in the 'options' or 'preferences' menu of your internet browser.\n\nIf you set your internet browser preferences to block all cookies, you may not be able to access all or parts of our site. If you delete cookies relating to this website, we will not remember things about you, including your cookie preferences, and you will be treated as a first-time visitor the next time you visit the site.\n\nTo find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit http://www.aboutcookies.org.uk/.\n\nQueries:\nIf you have any questions or comments regarding this Cookies policy, please email contact@dohadindia.org",
      },
    ],
  },
  termsOfService: {
    title: "Terms & Conditions",
    lastUpdated: "",
    sections: [
      {
        id: "terms-welcome",
        title: "Welcome to DOHaD India Regional Society!",
        content:
          "These terms and conditions outline the rules and regulations for the use of the DOHaD India regional society website.\n\nBy accessing this website we assume you accept these terms and conditions. Do not continue to use this site if you do not agree to take all of the terms and conditions stated on this page.",
      },
      {
        id: "terms-terminology",
        title: "Terminology",
        content:
          "The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: \"Client\", \"You\" and \"Your\" refers to you, the person log on this website and compliant to the Company's terms and conditions. \"The Company\", \"Ourselves\", \"We\", \"Our\" and \"Us\", refers to our Company. \"Party\", \"Parties\", or \"Us\", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services, in accordance with and subject to, prevailing law of us. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.",
      },
      {
        id: "terms-cookies",
        title: "Cookies",
        content:
          "We employ the use of cookies. By accessing DOHaD India Regional Society, you agreed to use cookies in agreement with the DOHaD India Regional Society's Privacy Policy.\n\nMost interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas, making it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.",
      },
      {
        id: "terms-license",
        title: "License",
        content:
          "Unless otherwise stated, DOHaD India Regional Society and/or its licensors own the intellectual property rights for all material on DOHaD India Regional Society. All intellectual property rights are reserved. You may access this from DOHaD India Regional Society for your own personal use subjected to restrictions set in these terms and conditions.\n\nYou must not:\n- Republish material from DOHaD India Regional Society\n- Sell, rent or sub-license material from DOHaD India Regional Society\n- Reproduce, duplicate or copy material from DOHaD India Regional Society\n- Redistribute content from DOHaD India Regional Society\n\nThis Agreement shall begin on the date hereof.",
      },
      {
        id: "terms-comments",
        title: "User Comments",
        content:
          "Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. DOHaD India Regional Society does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of DOHaD India Regional Society, its agents and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions. To the extent permitted by applicable laws, DOHaD India Regional Society shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.\n\nDOHaD India Regional Society reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.\n\nYou warrant and represent that:\n- You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;\n- The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;\n- The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy;\n- The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.\n\nYou hereby grant DOHaD India Regional Society a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.",
      },
      {
        id: "terms-hyperlinking",
        title: "Hyperlinking to our Content",
        content:
          "The following organizations may link to our Website without prior written approval:\n- Government agencies;\n- Search engines;\n- News organizations;\n- Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and\n- System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.\n\nThese organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.\n\nWe may consider and approve other link requests from the following types of organizations:\n- commonly-known consumer and/or business information sources;\n- dot.com community sites;\n- associations or other groups representing charities;\n- online directory distributors;\n- internet portals;\n- accounting, law and consulting firms; and\n- educational institutions and trade associations.\n\nWe will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of DOHaD India Regional Society; and (d) the link is in the context of general resource information.\n\nNo use of DOHaD INDIA Society's logo or other artwork will be allowed for linking absent a trademark license agreement.",
      },
      {
        id: "terms-iframes",
        title: "iFrames",
        content:
          "Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.",
      },
      {
        id: "terms-content-liability",
        title: "Content Liability",
        content:
          "We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.",
      },
      {
        id: "terms-reservation",
        title: "Reservation of Rights",
        content:
          "We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.",
      },
      {
        id: "terms-removal",
        title: "Removal of links from our website",
        content:
          "If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.\n\nWe do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.",
      },
      {
        id: "terms-disclaimer",
        title: "Disclaimer",
        content:
          "To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will:\n- limit or exclude our or your liability for death or personal injury;\n- limit or exclude our or your liability for fraud or fraudulent misrepresentation;\n- limit any of our or your liabilities in any way that is not permitted under applicable law; or\n- exclude any of our or your liabilities that may not be excluded under applicable law.\n\nThe limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty.\n\nAs long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.",
      },
    ],
  },
};


export interface NavSubItem {
  name: string;
  href: string;
}

export interface NavItem {
  name: string;
  href: string;
  subItems?: NavSubItem[];
}

export interface FooterLink {
  name: string;
  link: string;
}

export interface NavigationSettings {
  header: {
    tagline: string;
    ctaText: string;
    ctaLink: string;
    navItems: NavItem[];
  };
  footer: {
    copyrightText?: string;
    contactEmail?: string;
    quickLinks: FooterLink[];
    engagementLinks: FooterLink[];
  };
}

export const DEFAULT_NAVIGATION: NavigationSettings = {
  header: {
    tagline:
      "Advancing health through the developmental origins of health and disease research in India.",
    ctaText: "Become a Member",
    ctaLink: "/join-us",
    navItems: [
      { name: "Home", href: "/" },
      {
        name: "Who We Are",
        href: "/who-are-we",
        subItems: [
          { name: "Our Team", href: "/who-are-we" },
          { name: "Equity & Diversity", href: "/who-are-we/equity-diversity" },
          { name: "Governance", href: "/who-are-we/governance" },
        ],
      },
      { name: "Join Us", href: "/join-us" },
      { name: "Events", href: "/events" },
      { name: "Contact", href: "/contact" },
    ],
  },
  footer: {
    copyrightText: "DOHaD India Regional Society. All rights reserved.",
    contactEmail: "contact@dohadindia.org",
    quickLinks: [
      { name: "About DOHaD", link: "/#about-pillars-section" },
      { name: "Research", link: "/#features-section" },
      { name: "Capacity Building", link: "/#capacity-building-section" },
      { name: "Advocacy", link: "/#advocacy-section" },
      { name: "FAQ", link: "/#faq-section" },
    ],
    engagementLinks: [
      { name: "Become a Member", link: "/join-us" },
      { name: "Newsletter", link: "/#communication-section" },
      { name: "Upcoming Events", link: "/events" },
      { name: "Contact Us", link: "/contact" },
    ],
  },
};
