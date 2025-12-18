# Product API Frontend

A modern React-based frontend application for managing products and users through an admin dashboard. Built with Vite for fast development and featuring role-based authentication and responsive design.

## Features

- **Authentication & Authorization**: Secure login with role-based access control (Admin, Staff, Super Staff)
- **User Management**: Create, read, update, and delete users with role assignments
- **Product Management**: Full CRUD operations for products with search and pagination
- **Admin Dashboard**: Comprehensive dashboard for administrative tasks
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **API Integration**: Axios-based services for seamless backend communication

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Code Quality**: ESLint, Prettier
- **Development**: Hot Module Replacement (HMR)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the API endpoint in `src/config.js`:
   ```javascript
   export const API_BASE_URL = 'https://your-api-endpoint.com';
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- **Login**: Access the application via `/login` with appropriate credentials.
- **Admin Panel**: Navigate to `/admin` for dashboard, user management (`/admin/users`), and product management (`/admin/products`).
- **Role Permissions**:
  - Admin: Full access to all features
  - Super Staff: Product management and limited user access
  - Staff: Read-only access to users and products

## Project Structure

```
src/
├── auth/                 # Authentication components and utilities
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Pagination, Modals)
│   ├── layout/          # Layout components (Header, AdminLayout)
│   └── tables/          # Data table components
├── context/             # React context providers
├── pages/               # Page components
│   ├── admin/          # Admin-specific pages
│   └── CustomerBlank.jsx
├── services/            # API service modules
└── config.js           # Configuration file
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is private and proprietary.
