# TrackFast - Expense Tracker Frontend

A modern expense tracking application built with Next.js that helps users manage expenses and gain insights into their spending patterns.

## Features

- 🔐 Secure JWT authentication with HTTP-only cookies
- 📊 Interactive expense visualization with charts
- 🔍 Advanced filtering and search capabilities
- 🌓 Light/Dark theme support
- 📱 Fully responsive design
- ⚡ Real-time expense updates
- 📈 Spending insights and analytics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **State Management**: React Context + Hooks

## Getting Started

1. **Prerequisites**
   - Node.js 18+ 
   - npm or yarn
   - Backend server running

2. **Installation**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd client

   # Install dependencies
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy example env file
   cp .env.example .env.local

   # Configure environment variables
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Development**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

```
src/
├── app/                    # App router pages
│   ├── (auth)/            # Authentication pages
│   │   ├── login/
│   │   └── register/
│   └── dashboard/         # Main dashboard
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── services/             # API services
├── hooks/                # Custom hooks
├── lib/                  # Utilities
└── types/                # TypeScript types
```

## Key Features Implementation

### Authentication
- JWT-based authentication using HTTP-only cookies
- Protected routes with middleware
- Auto token refresh mechanism
- Secure logout functionality

### Expense Management
- Create, read, update, delete expenses
- Advanced filtering by date range and category
- Search functionality
- Pagination support

### Dashboard Features
- Expense summary charts
- Category-wise spending breakdown
- Date range filtering
- Real-time updates

### Theme Support
- Light/Dark mode toggle
- System preference detection
- Theme persistence
- Smooth transitions

## Available Scripts

```bash
# Development
npm run dev         # Start development server

# Production
npm run build      # Build for production
npm start         # Start production server

# Utility
npm run lint      # Run ESLint
npm run format    # Run Prettier
```

## Component Documentation

### Layout Components
- `UserMenu`: User profile and logout
- `ExpenseList`: Main expense display component
- `ExpenseChart`: Visualization component
- `AddExpenseDialog`: New expense form
- `EditExpenseDialog`: Edit expense form

### UI Components
All components are built on top of shadcn/ui:
- `Button`: Custom button component
- `Dialog`: Modal dialogs
- `Input`: Form inputs
- `Select`: Dropdown selects
- `DatePicker`: Date selection
- `Toast`: Notifications

## API Integration

The `services/api.ts` file handles all API calls:

```typescript
export const api = {
  expenses: {
    getAll: (params) => {...},
    create: (data) => {...},
    update: (id, data) => {...},
    delete: (id) => {...},
    getInsights: () => {...}
  },
  auth: {
    login: (credentials) => {...},
    register: (data) => {...},
    logout: () => {...}
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

