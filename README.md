# Ulmo E-Commerce

A modern e-commerce website built with React, Tailwind CSS, and Supabase.

## Features

- 🛍️ Modern e-commerce interface
- 🔐 User authentication (login/register)
- 🛒 Shopping cart functionality
- 📱 Responsive design (mobile-first)
- 🎨 Beautiful UI based on Figma design
- ⚡ Fast performance with Vite
- 🗄️ Supabase backend integration

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Build Tool**: Vite
- **UI Components**: Headless UI, Lucide React
- **Routing**: React Router v6
- **State Management**: Context API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/laofansay-ai/figma01.git
cd figma01
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)

2. Go to Settings > API to get your project URL and anon key

3. Run the database schema (see `database_schema.md` for SQL scripts):
   - Go to SQL Editor in your Supabase dashboard
   - Copy and run the SQL scripts from `database_schema.md`

4. Configure Row Level Security (RLS) policies as defined in the schema

### Development

Start the development server:
```bash
pnpm dev
# or
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
pnpm build
# or
npm run build
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) | No |

### Getting Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings > API
4. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Project API keys** → `anon public` → `VITE_SUPABASE_ANON_KEY`

## Database Schema

The application uses the following main tables:

- `profiles` - User profiles and metadata
- `categories` - Product categories
- `products` - Product catalog
- `cart_items` - Shopping cart items
- `orders` - Customer orders
- `order_items` - Order line items
- `user_addresses` - Customer addresses
- `wishlists` - User wishlists
- `product_reviews` - Product reviews and ratings
- `coupons` - Discount coupons

See `database_schema.md` for complete SQL schema and setup instructions.

## API Documentation

See `api_design.md` for complete API documentation including:

- Authentication endpoints
- Product management
- Shopping cart operations
- Order processing
- User management

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common components (Navigation, etc.)
│   └── ui/             # Base UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── context/            # React context providers
├── config/             # Configuration files
└── assets/             # Static assets
```

## Features Roadmap

### Phase 1: Core E-commerce ✅
- [x] User authentication
- [x] Product catalog
- [x] Shopping cart
- [x] Responsive design

### Phase 2: Enhanced Features (In Progress)
- [ ] Product search and filtering
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Order management
- [ ] Payment integration

### Phase 3: Advanced Features
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Analytics and reporting
- [ ] Email notifications
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help setting up the project, please:

1. Check the documentation in this README
2. Review the database schema in `database_schema.md`
3. Check the API documentation in `api_design.md`
4. Open an issue on GitHub

## Acknowledgments

- Design inspiration from Figma community
- Images from [Pexels](https://www.pexels.com)
- Icons from [Lucide](https://lucide.dev)
- UI components from [Headless UI](https://headlessui.com)

