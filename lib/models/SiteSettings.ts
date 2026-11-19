import mongoose, { Schema, model, models } from 'mongoose';
import { SECRETARIAT_WHO_WE_ARE_TEXT } from '@/lib/site-contact';

const SiteSettingsSchema = new Schema({
  hero: {
    headline: { type: String, default: 'Advancing DOHaD Research in India' },
    subheadline: { type: String, default: 'Promoting awareness and research on Developmental Origins of Health and Disease.' },
    ctaText: { type: String, default: 'Join Our Community' },
    ctaLink: { type: String, default: '/join-us' },
  },
  about: {
    title: { type: String, default: 'About DOHaD India' },
    content: { type: String },
  },
  learnDohad: {
    title: { type: String, default: 'What is DOHaD?' },
    badge: { type: String, default: 'Learn About DOHaD' },
    contentParagraph1: { type: String, default: 'The Developmental Origins of Health and Disease (DOHaD) is a multidisciplinary field that examines how the environment during early development (conception, fetal life, infancy, and early childhood) interacts with genetic and other factors to shape lifelong health and the risk of non-communicable diseases (NCDs) like diabetes, heart disease, and obesity.' },
    contentParagraph2: { type: String, default: 'This paradigm shift moves health focus from adult lifestyle choices alone to the critical importance of early-life environments, providing a powerful framework for preventing chronic diseases across generations.' },
    ctaText: { type: String, default: 'Learn more about the International Society.' },
    ctaLink: { type: String, default: 'https://dohadsoc.org/' },
    showCard: { type: Boolean, default: true },
    cardImage: { type: String, default: '' },
    cardName: { type: String, default: 'Prof. David Barker' },
    cardRole: { type: String, default: 'Pioneer of the DOHaD paradigm' },
  },
  socialLinks: {
    twitter: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    bluesky: { type: String },
  },
  policies: { type: Schema.Types.Mixed, default: {} },
  governancePage: {
    documentsSectionTitle: { type: String, default: 'Official Documents' },
    documentsSectionDescription: {
      type: String,
      default: 'Download or view our primary constitutional and guidelines files.',
    },
  },
  equityDiversityPage: {
    policiesSectionTitle: { type: String, default: 'Official Policies' },
    policiesSectionDescription: {
      type: String,
      default: 'Download or view our detailed institutional guidelines on equity and safeguarding.',
    },
  },
  whoWeArePage: {
    pageTitle: { type: String, default: 'Who We Are' },
    pageDescription: {
      type: String,
      default:
        'Meet the dedicated team of researchers, clinicians, and advocates leading DOHaD India\'s mission to advance developmental origins of health and disease research across the country.',
    },
    secretariatAddress: {
      type: String,
      default: SECRETARIAT_WHO_WE_ARE_TEXT,
    },
    organizationLinkedin: {
      type: String,
      default:
        'https://www.linkedin.com/in/dohad-india-regional-society-2b784240b/',
    },
    executiveCouncil: {
      title: { type: String, default: 'Executive Council' },
      description: {
        type: String,
        default:
          'Our leadership team guiding DOHaD India\'s strategic initiatives',
      },
    },
    advisoryGroup: {
      title: { type: String, default: 'Advisory Group' },
      description: {
        type: String,
        default:
          'Distinguished advisors providing strategic guidance and expertise',
      },
    },
  },
  eventsPage: {
    pageTitle: { type: String, default: 'Events & Workshops' },
    pageDescription: {
      type: String,
      default:
        'Discover upcoming opportunities and explore highlights from our conferences, workshops, and community gatherings advancing DOHaD research.',
    },
    upcomingEvents: {
      title: { type: String, default: 'Upcoming Events' },
      subtitle: { type: String, default: 'Join us at our next events and workshops' },
    },
    pastEventsGallery: {
      title: { type: String, default: 'Past Events Gallery' },
      subtitle: {
        type: String,
        default: 'Highlights from our conferences, talks, and community gatherings',
      },
      featuredVideo: {
        youtubeVideoId: { type: String, default: '1dHV_CnCDC8' },
        title: {
          type: String,
          default: 'Shaping the Future of DOHaD Research in India',
        },
        description: {
          type: String,
          default:
            'Hear from our President, Prof. Debarati Mukherjee, about our vision and strategies to shape the future of DOHaD research in India.',
        },
      },
    },
    whatWeOffer: {
      title: { type: String, default: 'What We Offer' },
      subtitle: {
        type: String,
        default: 'Event types we are building for the DOHaD community',
      },
      items: {
        type: [
          {
            title: { type: String },
            description: { type: String },
          },
        ],
        default: [
          {
            title: 'Annual Conferences',
            description:
              'Flagship gatherings bringing together DOHaD researchers from across India for knowledge sharing and networking.',
          },
          {
            title: 'Workshops & Training',
            description:
              'Capacity building workshops, methodology training, and skill development sessions for researchers at all career stages.',
          },
          {
            title: 'Networking Events',
            description:
              'Opportunities to connect with fellow researchers, build collaborations, and strengthen the DOHaD community.',
          },
        ],
      },
    },
  },
  faqs: {
    type: [
      {
        question: { type: String, required: true },
        answer: { type: String, default: '' },
        hasLink: { type: Boolean, default: false },
        linkText: { type: String, default: '' },
        linkUrl: { type: String, default: '' },
        hasTable: { type: Boolean, default: false },
        tableData: [
          {
            category: { type: String, default: '' },
            fee: { type: String, default: '' },
          },
        ],
        tableFooter: { type: String, default: '' },
        order: { type: Number, default: 0 },
      },
    ],
    default: undefined,
  },
  membershipPage: {
    hero: {
      title: { type: String, default: "Join Our Community & Advance DOHaD Research" },
      description: {
        type: String,
        default: "Be part of India's leading network of researchers and professionals working on the developmental origins of health and disease. Collaborate, learn, and grow with us.",
      },
    },
    whoCanJoin: {
      title: { type: String, default: "Who Can Become a Member?" },
      content: {
        type: String,
        default: "Membership is open to anyone interested in DOHaD research, policy, and practice. This includes researchers, clinicians, policymakers, students, and professionals from related fields.",
      },
    },
    tiers: {
      type: [
        {
          name: { type: String, required: true },
          fee: { type: String, required: true },
          period: { type: String, default: "Annual Fee" },
          order: { type: Number, default: 0 },
        },
      ],
      default: undefined,
    },
    tierNotes: {
      note1: {
        type: String,
        default: "The DOHaD India annual fee supports our website maintenance and contributes towards other activities undertaken by the DOHaD India Regional Society.",
      },
      note2: {
        type: String,
        default: "Eligibility for reduced International Society LMIC/MIC membership rates is determined by the member's country of residence and work, in accordance with International Society membership policies.",
      },
    },
    howToJoin: {
      title: { type: String, default: "How to Become a Member" },
      description1: {
        type: String,
        default: "Join the DOHaD India community and help advance research, collaboration, and awareness across the region.",
      },
      description2: {
        type: String,
        default: "International Society membership fees are separate and remain payable according to the member's applicable membership category.",
      },
      buttonText: { type: String, default: "Go to Registration" },
      buttonLink: { type: String, default: "https://dohadsoc.org/join-us/" },
    },
  },
  researchFocus: {
    title: {
      type: String,
      default: "Research Focus Areas",
    },
    subtitle: {
      type: String,
      default:
        "Our research spans multiple disciplines to understand how early-life exposures affect long-term health outcomes in Indian populations",
    },
    pillars: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, default: "" },
          icon: { type: String, default: "Dna" },
          order: { type: Number, default: 0 },
        },
      ],
      default: undefined,
    },
  },
  narratives: {
    capacityBuilding: {
      title: { type: String, default: "Capacity Building" },
      subtitle: {
        type: String,
        default:
          "We support the next generation of DOHaD researchers through structured training and hands-on experience.",
      },
      buttonText: {
        type: String,
        default: "View Upcoming Events & Workshops",
      },
      buttonLink: { type: String, default: "/events" },
      items: {
        type: [
          {
            title: { type: String },
            description: { type: String },
            icon: { type: String, default: "GraduationCap" },
          },
        ],
        default: undefined,
      },
    },
    advocacy: {
      title: {
        type: String,
        default: "National Impact through Engagement",
      },
      subtitle: {
        type: String,
        default:
          "We bridge the gap between scientific discovery and public health action, collaborating with stakeholders across India to ensure early-life health is a national priority.",
      },
      items: {
        type: [
          {
            title: { type: String },
            description: { type: String },
            icon: { type: String, default: "FileHeart" },
          },
        ],
        default: undefined,
      },
    },
    communication: {
      title: {
        type: String,
        default: "Communication & Outreach",
      },
      subtitle: {
        type: String,
        default:
          "We actively promote and disseminate DOHaD research across India and globally through multiple communication platforms",
      },
      webinarsTitle: { type: String, default: "Webinars & Events" },
      webinarsDescription: {
        type: String,
        default:
          "Regular webinars featuring renowned Indian and international experts to share emerging insights from DOHaD research.",
      },
      webinarsBullets: {
        type: [String],
        default: [
          "Expert talks on emerging DOHaD research",
          "Methods workshops for practical skills",
          "Policy roundtables for collaborative discussions",
        ],
      },
      followUsTitle: { type: String, default: "Follow Us" },
      followUsDescription: {
        type: String,
        default:
          "Stay updated with carefully curated insights on recent publications, events, funding opportunities, and valuable member contributions.",
      },
    },
  },
  legalPages: {
    privacyPolicy: {
      title: { type: String, default: 'Privacy Policy' },
      lastUpdated: { type: String, default: '12 April 2022' },
      sections: {
        type: [
          {
            id: { type: String },
            title: { type: String },
            content: { type: String },
          },
        ],
        default: undefined,
      },
    },
    termsOfService: {
      title: { type: String, default: 'Terms & Conditions' },
      lastUpdated: { type: String, default: '' },
      sections: {
        type: [
          {
            id: { type: String },
            title: { type: String },
            content: { type: String },
          },
        ],
        default: undefined,
      },
    },
  },
  navigation: {
    header: {
      tagline: {
        type: String,
        default:
          'Advancing health through the developmental origins of health and disease research in India.',
      },
      ctaText: { type: String, default: 'Become a Member' },
      ctaLink: { type: String, default: '/join-us' },
      navItems: { type: Array, default: undefined },
    },
    footer: {
      copyrightText: {
        type: String,
        default: 'DOHaD India Regional Society. All rights reserved.',
      },
      contactEmail: { type: String, default: 'contact@dohadindia.org' },
      quickLinks: { type: Array, default: undefined },
      engagementLinks: { type: Array, default: undefined },
    },
  },
  footerText: { type: String },
}, { timestamps: true });

export default models.SiteSettings || model('SiteSettings', SiteSettingsSchema);
