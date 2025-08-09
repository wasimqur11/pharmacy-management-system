# Pharmacy Management System

A comprehensive cloud-based pharmacy management solution built with Node.js, React, and PostgreSQL.

## Features

### Phase 1 (MVP)
- [x] User authentication and role-based access control
- [x] Multi-user support (Patients, Doctors, Pharmacists, Admin, Partners)
- [x] Basic dashboard with user-specific navigation
- [ ] Doctor consultation system
- [ ] Inventory management
- [ ] Point of sale system

### Phase 2 (Business Logic)
- [ ] Multi-partner profit sharing calculations
- [ ] Distributor credit management
- [ ] Weekly settlement automation
- [ ] Expense tracking and salary management
- [ ] Financial reporting dashboard

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, Vite
- **Database**: PostgreSQL
- **Authentication**: JWT with bcrypt
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites
- Node.js (v16+)
- Docker & Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pharmacy-management
```

2. Start the database:
```bash
docker-compose up -d postgres
```

3. Set up the backend:
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

4. Set up the frontend:
```bash
cd frontend
npm install
npm run dev
```

### Default Access

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Database Admin (pgAdmin): http://localhost:5050

### Demo Credentials
- **Admin**: admin@pharmacy.com / password
- **Doctor**: doctor@pharmacy.com / password  
- **Pharmacist**: pharmacist@pharmacy.com / password

## Project Structure

```
pharmacy-management/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   └── config/              # Configuration files
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
├── database/                # Database scripts
│   ├── init/                # Initialization scripts
│   └── seeds/               # Seed data
└── docker-compose.yml       # Docker services
```

## Development

### Backend Development
```bash
cd backend
npm run dev        # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Run linter
```

### Frontend Development
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Database Management
```bash
# Start database
docker-compose up -d postgres

# Access database
docker-compose exec postgres psql -U postgres -d pharmacy_management

# Stop database
docker-compose down
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### User Roles
- **Patient**: Can book consultations, view prescriptions
- **Doctor**: Can manage consultations, create prescriptions
- **Pharmacist**: Can manage inventory, process sales
- **Admin**: Full system access
- **Partner**: Can view reports and financial data

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with Joi
- Rate limiting
- CORS protection
- Security headers with Helmet

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.