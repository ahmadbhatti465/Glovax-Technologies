# Glovax Technologies

A premium, dark-themed agency website built with Next.js 16, React 19, and Tailwind CSS v4. Designed for a software house and digital agency to showcase services, portfolio, team, and capture leads through a fully functional contact form.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 |
| UI Primitives | [shadcn/ui](https://ui.shadcn.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Email | [Resend](https://resend.com/) |
| Icons | [Lucide React](https://lucide.dev/) |

---

## Features

- **Homepage** — Hero, client marquee, services grid, featured portfolio showcase, process steps, stats counter, testimonials, and CTA banner.
- **Portfolio / Work** — Curated project grid with real-world case studies, hover effects, and image cards.
- **Services** — Detailed service offerings with feature lists.
- **About** — Company story and values.
- **Team** — Team member profiles.
- **Blog** — Article listing page.
- **Careers** — Open positions with application flow.
- **Contact** — Fully functional lead capture form with email notifications and client confirmation emails.
- **Responsive Design** — Mobile-first, fully responsive across all breakpoints.
- **Performance** — Static generation, optimized images, CSS optimization enabled.

---

## Project Structure

```
glovax-technologies/
├── public/
│   └── images/
│       └── portfolio/          # Portfolio project images
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/contact/        # Contact form API route
│   │   ├── about/
│   │   ├── blog/
│   │   ├── career/
│   │   ├── contact/
│   │   ├── services/
│   │   ├── team/
│   │   ├── work/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx            # Homepage
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   ├── sections/           # Homepage section components
│   │   ├── shared/             # Reusable components (SectionHeader, MagneticButton, etc.)
│   │   └── ui/                 # shadcn/ui primitives
│   ├── data/
│   │   ├── portfolio.ts        # Portfolio items data
│   │   ├── services.ts         # Services data
│   │   └── testimonials.ts     # Testimonials data
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   ├── constants.ts        # Site config, nav links, stats
│   │   └── utils.ts            # cn() helper
│   └── types/
│       └── index.ts             # TypeScript interfaces
├── components.json              # shadcn/ui config
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd glovax-technologies

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
RESEND_API_KEY=re_your_actual_api_key_here
OWNER_EMAIL=your-email@example.com
```

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Your Resend API key for sending contact form emails |
| `OWNER_EMAIL` | The email address where contact form submissions are sent. Must match the email used to sign up for Resend. |

### Run Locally

```bash
# Development server
npm run dev

# Production build
npm run build
npm start
```

The dev server runs at `http://localhost:3000`.

---

## Contact Form

The contact form at `/contact` uses the Resend API to send two emails:

1. **Owner notification** — Sent to `OWNER_EMAIL` with the lead details.
2. **Client confirmation** — Sent to the person who filled the form.

> **Note:** When using Resend's free tier with `onboarding@resend.dev` as the sender, emails can only be delivered to the address associated with your Resend account. For production, configure a custom domain in Resend.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Deployment

This project is configured for **standalone** output in `next.config.ts`, making it ideal for containerized deployments (Docker, Railway, Fly.io, etc.).

To deploy to [Vercel](https://vercel.com/):

```bash
vercel --prod
```

Remember to add your environment variables in the Vercel dashboard under **Project Settings > Environment Variables**.

---

## License

Private — All rights reserved.
