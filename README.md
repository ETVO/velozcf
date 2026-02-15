# 🏡 VelozCF - Real Estate Sales Platform

A full-featured real estate sales application for fractional ownership properties (cotas), featuring a React.js frontend, custom PHP REST API, and integration with Clicksign for digital contract signatures.

## 🎯 Overview

VelozCF is a comprehensive sales platform built for CF Negócios, enabling real estate agents to manage property listings, create purchase proposals, and process digital contracts. The system handles fractional ownership sales (sistema de cotas), where properties are divided into shares that can be purchased individually or in packages.

The platform features separate interfaces for customers (frontend) and administrators (admin panel), with a custom REST API backend handling all business logic and external integrations.

## ✨ Key Features

### Customer-Facing Frontend
- **Property Listings** - Browse available real estate developments (empreendimentos)
- **Detailed Property Views** - View cabins/units with image galleries, maps, and pricing
- **Purchase Proposals** - Multi-step proposal creation with buyer information
- **Digital Signatures** - Automatic contract generation via Clicksign integration
- **Responsive Design** - Mobile-friendly interface for on-the-go sales

### Admin Dashboard
- **Proposal Management** - Review, approve, and track purchase proposals
- **Property Management** - Create and manage developments, cabins, and cotas (shares)
- **User Management** - Manage sales agents, real estate agencies, and representatives
- **Image Management** - Upload and organize property photos
- **Settings & Configuration** - System-wide settings and contract signatories

### Backend & API
- **RESTful API** - Clean, organized endpoints for all resources
- **Authentication** - Secure login system with session management
- **Clicksign Integration** - Automated contract generation and digital signature workflow
- **Email Notifications** - Automated emails for contract signatures and updates
- **Database Design** - Comprehensive MySQL schema with proper relationships

## 🏗️ Architecture

### Three-Tier Application

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Frontend       │────▶│  REST API       │────▶│  MySQL DB       │
│  (React.js)     │     │  (PHP)          │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Admin Panel    │
                        │  (React.js)     │
                        └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Clicksign API  │
                        │  (External)     │
                        └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend (Customer Interface)
- **React.js** - Component-based UI
- **React Router** - Client-side routing
- **Bootstrap 5** - Responsive styling
- **SCSS** - Enhanced CSS with variables and mixins

### Admin Panel
- **React.js** - Modern admin interface
- **React Bootstrap** - UI components
- **React Router v6** - Navigation
- **Moment.js** - Date formatting
- **React Input Mask** - Form input formatting
- **MD5** - Password hashing

### Backend API
- **PHP** - Native PHP (no framework)
- **Custom REST API** - Hand-built RESTful architecture
- **MySQL** - Relational database
- **OOP Design** - Object-oriented models and controllers
- **Clicksign API** - Digital signature integration
- **PHPMailer** - Email notifications

## 📊 Data Models

### Core Entities
- **Empreendimentos** (Developments) - Real estate projects
- **Cabanas** (Cabins/Units) - Individual properties within developments
- **Cotas** (Shares) - Fractional ownership shares
- **Propostas** (Proposals) - Purchase proposals from buyers
- **Users** - Sales agents and administrators
- **Imobiliarias** (Agencies) - Real estate agencies
- **Pagamentos** (Payments) - Payment terms and pricing

### API Endpoints

```
/api/auth/              # Authentication
  - login.php
  - logout.php

/api/empreendimentos/   # Property developments
  - create.php
  - read.php
  - read_single.php
  - update.php
  - delete.php

/api/propostas/         # Purchase proposals
  - create.php
  - read.php
  - update.php
  - approve.php
  - clicksign.php

/api/users/             # User management
/api/cabanas/           # Cabin/unit management
/api/cotas/             # Share management
/api/imobiliarias/      # Agency management
/api/imagens/           # Image uploads
/api/configs/           # System settings
```

## 🔐 Clicksign Integration

The platform integrates with Clicksign for automated contract management:

1. **Proposal Approval** - When admin approves a proposal
2. **Document Generation** - Creates contract from template with buyer data
3. **Signer Creation** - Adds all parties (buyer, seller, witnesses, representatives)
4. **Email Notification** - Automatic signature request emails
5. **Status Tracking** - Monitors signature completion

Supports two contract types:
- **Agency Model** - When seller is associated with a real estate agency
- **Independent Model** - For autonomous sellers

## 🚀 Running This Project

### Prerequisites

- PHP 7.4+
- MySQL 5.7+
- Node.js 14+ and npm
- Apache/Nginx web server
- Clicksign account (for signature functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/ETVO/velozcf.git
cd velozcf

# Configure database
# Edit config/Database.php with your MySQL credentials

# Import database schema
mysql -u username -p database_name < config/sql/schema.sql

# Install frontend dependencies
cd frontend
npm install
npm run build

# Install admin dependencies
cd ../admin
npm install
npm run build

# Configure web server to point to project root
# Ensure API endpoints are accessible
```

### Development Mode

```bash
# Frontend development server
cd frontend
npm start
# Runs on http://localhost:3000

# Admin development server
cd admin
npm start
# Runs on http://localhost:3001 (or next available port)
```

### Configuration

1. **Database**: Update `/config/Database.php` with credentials
2. **Clicksign**: Update API tokens in `/config/Clicksign.php`
3. **Email**: Configure SMTP settings in `/config/Email.php`
4. **URLs**: Update homepage URLs in package.json files

## 📁 Project Structure

```
velozcf/
├── frontend/               # Customer-facing React app
│   ├── src/
│   │   ├── pages/         # Main pages
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   └── helpers/       # Utility functions
│   └── public/            # Static assets
├── admin/                  # Admin panel React app
│   └── src/
│       ├── pages/         # Admin pages
│       └── components/    # Admin components
├── api/                    # REST API endpoints
│   ├── auth/              # Authentication
│   ├── empreendimentos/   # Developments
│   ├── propostas/         # Proposals
│   ├── users/             # Users
│   └── ...                # Other resources
├── models/                 # PHP data models
│   ├── Proposta.php
│   ├── Empreendimento.php
│   ├── User.php
│   └── ...
├── config/                 # Configuration files
│   ├── Database.php
│   ├── Clicksign.php
│   ├── Email.php
│   └── sql/               # Database schemas
└── public/                 # Public assets
    └── maps/              # Map images
```

## 🎓 Technical Highlights

### Custom REST API Design
Built a complete REST API from scratch without frameworks, implementing:
- Consistent endpoint structure
- JSON request/response handling
- Authentication middleware
- CORS headers
- Error handling and validation

### External API Integration
Implemented complex Clicksign workflow:
- Document template population
- Multi-party signature orchestration
- Webhook handling
- Error recovery

### React Architecture
- Component composition patterns
- Custom hooks for API calls
- Routing with protected routes
- Form state management
- Responsive design principles

## 💼 Business Value

This platform streamlines the real estate sales process by:
- Reducing proposal processing time from hours to minutes
- Eliminating paper contracts with digital signatures
- Providing real-time proposal tracking
- Enabling remote sales operations
- Maintaining detailed audit trails

## 👤 Author

**Estevão Pereira Rolim** - [@ETVO](https://github.com/ETVO) | [LinkedIn](https://linkedin.com/in/estevao-p-rolim)

Full Stack Developer | 8 years of experience

Built as a production application for CF Negócios, demonstrating full-stack development capabilities with React.js frontend and custom PHP REST API.

---

*Production real estate sales platform with React.js, custom PHP REST API, and Clicksign integration.*

*README created in collaboration with Claude AI.*
