# Trucker Finance App

A modern, responsive finance management application designed specifically for truck drivers to track their income and expenses on a weekly basis.

## 🚛 Features

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

- Node.js (version 18 or higher)
- npm or yarn package manager
- Supabase account and project
- Google Cloud Console account (for Google OAuth)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cash-truck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Supabase Setup**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the database migrations:
     ```bash
     npx supabase db push
     ```

4. **Environment Setup**
   Create a `.env` file in the root directory:

   **Basic Configuration:**
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   **To regenerate these values:**
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the Project URL and anon/public key

5. **Google OAuth Setup (Optional)**
   If you want to enable Google sign-in:

   a. **Create Google OAuth credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
   - Set authorized redirect URI to: `https://your-project.supabase.co/auth/v1/callback`

   b. **Configure in Supabase:**
   - Go to Authentication > Providers in your Supabase dashboard
   - Enable Google provider
   - Enter your Google Client ID and Client Secret

   c. **Update environment variables:**
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Database Setup**
   Run the Supabase migrations:
   ```bash
   npx supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Verify setup (recommended)**
   ```bash
   ./verify-setup.sh
   ```

7. **Build for production**
   ```bash
   npm run build
   npm run preview
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

## 🙋‍♂️ Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

## 🐛 Troubleshooting

### Database Issues
If you encounter database-related errors:

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
- **Google OAuth:** Ensure Google provider is enabled in Supabase
- **Reset password:** Check email templates in Supabase Auth settings
- **Environment variables:** Verify `.env` file has correct values

### Build Issues
- Clear cache: `rm -rf node_modules/.vite && npm run dev`
- Reinstall: `rm -rf node_modules package-lock.json && npm install`

## 📊 Database Schema

```
weeks
├── id (uuid, primary key)
├── start_date (date)
├── end_date (date)
├── user_id (uuid, references auth.users)
└── created_at (timestamp)

expenses
├── id (uuid, primary key)
├── week_id (uuid, references weeks)
├── date (date)
├── amount (decimal)
├── category (text: 'fuel', 'maintenance', 'other')
├── description (text)
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