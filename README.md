# DOHaD India Regional Society

![DOHaD India Banner](public/join-us-community.png)

Welcome to the official repository for the **DOHaD (Developmental Origins of Health and Disease) India Regional Society** web platform. This platform serves to advance DOHaD research, coordinate regional activities, and facilitate professional collaboration across India and the South Asian region.

## 🚀 Tech Stack

This project is built with modern, high-performance web technologies:

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Media Hosting:** [Cloudinary](https://cloudinary.com/)
- **Email Service:** [Resend](https://resend.com/)
- **Authentication:** Custom JWT-based Role-Based Access Control (RBAC)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

## 🏗️ Architecture & Features

*   **Robust Security:** Implements strict middleware validation, mitigating privilege escalation and user enumeration attacks.
*   **Performance Optimized:** Fully utilizes Next.js Image Optimization, On-Demand Incremental Static Regeneration (ISR), and strict React Hydration handling.
*   **Type Safety:** 100% strictly typed frontend and backend architectures ensuring maximum stability in production.
*   **Dynamic CMS:** Admin dashboard equipped for dynamic events, advisories, newsletters, and gallery management.

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed locally:
*   [Node.js](https://nodejs.org/) (v20.x or v22.x recommended)
*   npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dohadindiaorg/Dohad-India.git
   cd Dohad-India
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and configure the required secure variables:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Cloudinary
   CLOUDINARY_URL=your_cloudinary_url
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

   # Email Service
   RESEND_API_KEY=your_resend_api_key

   # Authentication
   JWT_SECRET=your_secure_jwt_secret
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).
To deploy:
1. Import the repository into your Vercel Dashboard.
2. Add all the environment variables from `.env.local` into the Vercel project settings.
3. Deploy! The project utilizes standard Next.js build commands (`npm run build`).

## 🛡️ License & Ownership

This source code and its associated assets are the exclusive property of the **DOHaD India Regional Society**. 

*Maintained by the DOHaD India IT & Operations Team.*
