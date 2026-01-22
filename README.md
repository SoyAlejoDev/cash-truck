# 🚛 Trucker Finance App

A modern, responsive finance management application designed specifically for truck drivers to track their income and expenses on a weekly basis.

**Live Demo**: [Coming Soon]  
**Documentation**: [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)

## ✨ Features

- **Weekly Financial Tracking**: Monitor income and expenses by week with easy navigation
- **Income Management**: Record and track all income sources (freights, bonuses, etc.)
- **Expense Tracking**: Log fuel, maintenance, tolls, food, and other trucking expenses
- **Financial Dashboard**: View summaries, breakdowns, and financial health at a glance
- **Reports**: Generate monthly and yearly financial reports
- **User Authentication**: Secure login system powered by Supabase
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Data**: Instant updates and synchronization across devices

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL database, authentication)
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Development Tools**: ESLint, TypeScript, PostCSS

## 📋 Prerequisites

- **Node.js** v18+ and **pnpm** (or npm/yarn)
- **Supabase** account ([create one here](https://supabase.com))
- **Git** for version control
- _Optional:_ **Google Cloud Console** account (for Google OAuth integration)

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd trucker-finance-app
```

### Step 2: Install Dependencies

```bash
pnpm install
# or: npm install / yarn install
```

### Step 3: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Wait for the project to initialize

### Step 4: Set Up Environment Variables

Create a `.env.local` file in the project root (this file is already in `.gitignore`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxx
```

**How to get these values:**

1. Go to your Supabase project dashboard
2. Navigate to **Settings > API Keys**
3. Copy **Project URL**
4. Copy **Publishable Key** (new format: `sb_publishable_xxx`)
5. ⚠️ **Never expose `service_role` key in the browser**

### Step 5: Run Database Migrations

```bash
npx supabase db push
```

### Step 6: Set Up Google OAuth (Optional)

For detailed Google OAuth setup instructions, see [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)

### Step 7: Start Development Server

```bash
pnpm run dev
```

The app will be available at `http://localhost:5173`

### Step 8: Build for Production

```bash
pnpm run build      # Build optimized bundle
pnpm run preview    # Preview production build locally
```

## 📖 Usage

### Getting Started

1. Create an account or log in to your existing account
2. The dashboard will show your current week's financial overview
3. Use the week selector to navigate between different weeks

### Adding Income

- Click "Add Income" in the Income section
- Enter the amount, description, and date
- Income will be automatically added to your weekly totals

### Recording Expenses

- Click "Add Expense" in the Expenses section
- Select expense category (Fuel, Maintenance, Tolls, etc.)
- Enter amount, description, and date
- View expense breakdown in the dashboard

### Viewing Reports

- Navigate to the Reports page
- Generate monthly or yearly financial reports
- Export or print reports as needed

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   ├── expenses/        # Expense-related components
│   ├── income/          # Income-related components
│   ├── layout/          # Layout and navigation
│   └── reports/         # Report components
├── context/             # React Context providers
├── pages/               # Main application pages
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── lib/                 # External service configurations
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Security Best Practices

- ✅ Never commit `.env.local` (already in `.gitignore`)
- ✅ Always use `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` in browser code
- ✅ Keep `service_role` key secret - use only in backend/Edge Functions
- ✅ Enable Row Level Security (RLS) policies in Supabase
- ✅ Rotate API keys if they're accidentally exposed
- ✅ Use HTTPS in production

## 🆘 Getting Help

- 📖 Check the [Troubleshooting](#troubleshooting) section above
- 🔗 Read [Supabase Docs](https://supabase.com/docs)
- 📧 See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) for OAuth help
- 🐙 Open an issue on GitHub for bugs or feature requests

## 🐛 Troubleshooting

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `pnpm run dev`      | Start development server (Vite)   |
| `pnpm run build`    | Build optimized production bundle |
| `pnpm run preview`  | Preview production build locally  |
| `pnpm run lint`     | Run ESLint to check code quality  |
| `pnpm run lint:fix` | Auto-fix ESLint issues            |

**Using npm/yarn instead?** Replace `pnpm` with `npm` or `yarn`

1. **Run the verification script:**

   ```bash
   ./verify-setup.sh
   ```

2. **Check database tables:**
   - Ensure migrations are applied in Supabase Dashboard > SQL Editor
   - Run the SQL from `supabase/migrations/` files

3. **Fix RLS policies:**
   - If RLS errors occur, run `fix-rls.sql` in SQL Editor

### Authentication Issues

Environment Variables Not Loading

**Error:** `Missing Supabase environment variables`

**Solution:**

1. Verify `.env.local` exists in project root
2. Variables must start with `VITE_` prefix
3. Restart dev server after changing `.env.local`
4. Check for typos in variable names

### Database Connection Issues

**Error:** "Unable to connect to database"

**Solution:**

1. Verify `VITE_SUPABASE_URL` is correct
2. Check Supabase project is active (not paused)
3. Ensure database migrations are applied:
   ```bash
   npx supabase db push
   ```

### Authentication Errors

**Google OAuth not working:**

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React 18 Guide](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Happy trucking and stay profitable! 🚚💰**

Made with ❤️ for truck driversentication > Providers

- Check redirect URI matches exactly: `https://your-project.supabase.co/auth/v1/callback`
- See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) for detailed setup

**Login/Signup failures:**

- Check `.env.local` has correct `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- Verify RLS policies are properly configured in Supabase

### Build/Performance Issues

**Clear cache and reinstall:**

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run dev
```

**Dev server not starting:**

```bash
# Kill any running processes on port 5173
lsof -ti:5173 | xargs kill -9
pnpm run dev
``
├── user_id (uuid, references auth.users)
└── created_at (timestamp)

incomes
├── id (uuid, primary key)
├── week_id (uuid, references weeks)
├── date (date)
├── amount (decimal)
├── description (text)
├── user_id (uuid, references auth.users)
└── created_at (timestamp)
```

---

**Happy trucking and stay profitable! 🚚💰**
