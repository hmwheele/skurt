# Excursion Hub - Travel Excursion Aggregator

A modern web application that aggregates travel excursions from multiple providers (Viator, GetYourGuide, Klook, KKDay) in one place, allowing users to compare and book activities through affiliate links.

## Features

- 🔍 **Search & Compare**: Search excursions across multiple providers
- 📅 **Multi-Day Planning**: Plan trips across multiple days
- ❤️ **Save Favorites**: Save excursions for later
- 📊 **User Reviews**: Rate and review excursions
- 🔐 **User Authentication**: Secure authentication with Supabase
- 💼 **Affiliate Revenue**: Generate revenue through affiliate links

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database & Auth**: Supabase
- **APIs**: Viator, GetYourGuide (and more)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- Viator affiliate API key

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/hmwheele/skurt.git
cd skurt
\`\`\`

### 2. Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

### 3. Set Up Environment Variables

Copy the example environment file and fill in your values:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` and add:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Viator API
VIATOR_API_KEY=your_viator_api_key

# GetYourGuide API (when approved)
GETYOURGUIDE_API_KEY=your_getyourguide_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Set Up Supabase

Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
1. Create a Supabase project
2. Get your API keys
3. Run the database schema
4. Configure authentication

### 5. Run the Development Server

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

\`\`\`
skurt/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── search/        # Search excursions endpoint
│   ├── dashboard/         # User dashboard page
│   ├── search/            # Search results page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth-modal.tsx    # Authentication modal
│   ├── excursion-card.tsx         # Excursion card component
│   ├── excursion-detail-panel.tsx # Slide-out detail panel
│   ├── trip-planner.tsx  # Multi-day trip planner
│   └── ...               # Other components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client & server
│   ├── viator/           # Viator API client
│   └── types/            # TypeScript types
├── supabase/             # Supabase schema and migrations
│   └── schema.sql        # Database schema
└── ...
\`\`\`

## API Integration

### Currently Integrated

- ✅ **Viator**: Full integration with search and product details

### Pending Approval

- ⏳ **GetYourGuide**: Awaiting partner approval
- ⏳ **Klook**: Awaiting affiliate approval
- ⏳ **KKDay**: Awaiting affiliate approval

## Affiliate Setup

### Viator

1. Sign up for [Viator Affiliate Program](https://partnerresources.viator.com/)
2. Get your API key from the partner dashboard
3. Add to `.env.local` as `VIATOR_API_KEY`
4. Update affiliate tracking in `lib/viator/client.ts` with your affiliate ID

### GetYourGuide (When Approved)

1. Apply for [GetYourGuide Partner Program](https://partner.getyourguide.com/)
2. Get API credentials
3. Add to `.env.local`
4. Implement client in `lib/getyourguide/client.ts`

## Development

### Running Tests

\`\`\`bash
pnpm test
\`\`\`

### Building for Production

\`\`\`bash
pnpm build
\`\`\`

### Linting

\`\`\`bash
pnpm lint
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repo in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

\`\`\`bash
vercel
\`\`\`

## Features Roadmap

- [x] Search and display excursions
- [x] Slide-out detail panel
- [x] User authentication
- [x] Save favorites
- [x] Multi-day trip planner
- [x] Booking history tracking
- [ ] Connect real Viator API (pending API key)
- [ ] Add GetYourGuide integration
- [ ] Add Klook integration
- [ ] Add KKDay integration
- [ ] Advanced filtering (price, duration, rating)
- [ ] Map view for excursions
- [ ] Email notifications
- [ ] Social sharing

## Contributing

This is a private project. For questions or issues, please contact the repository owner.

## License

Private - All Rights Reserved

## Contact

- Repository: [https://github.com/hmwheele/skurt](https://github.com/hmwheele/skurt)
- Issues: [https://github.com/hmwheele/skurt/issues](https://github.com/hmwheele/skurt/issues)
