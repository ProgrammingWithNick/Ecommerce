# 🛒 ProgrammingWithNick E-Commerce

<div align="center">

![Project Logo](https://img.shields.io/badge/PWN-E--Commerce-ff6b6b?style=for-the-badge)

[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redux](https://img.shields.io/badge/Redux-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*A full-featured e-commerce platform with admin panel, user authentication, PayPal payments, and more!*

</div>

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

ProgrammingWithNick E-Commerce is a complete online shopping solution with separate customer and admin interfaces. The application provides a seamless shopping experience from browsing products to checkout and payment processing, along with a powerful admin dashboard for managing products, orders, and more...

---

## 💻 Tech Stack

### Backend
- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[MongoDB](https://www.mongodb.com/)** with Mongoose - Database
- **[JWT](https://jwt.io/)** - Authentication
- **[PayPal SDK](https://developer.paypal.com/docs/api/overview/)** - Payment processing
- **[Cloudinary](https://cloudinary.com/)** - Image storage and management

### Frontend
- **[React](https://reactjs.org/)** with **[TypeScript](https://www.typescriptlang.org/)** - UI library
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - State management
- **[React Router](https://reactrouter.com/)** - Routing
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Axios](https://axios-http.com/)** - HTTP client
- **[Vite](https://vitejs.dev/)** - Build tool

---

## ✨ Features

### Customer Features
- **User Account Management**
  - Registration and login
  - Password recovery
  - Profile management
- **Shopping Experience**
  - Product search and filtering
  - Detailed product views with images
  - Cart management
  - Address book
  - Review and rating system
- **Checkout Process**
  - Address selection
  - PayPal integration
  - Order confirmation
- **Order Management**
  - Order history
  - Order status tracking
  - Order details

### Admin Features
- **Dashboard**
  - Sales analytics
  - Recent orders
  - Inventory status
- **Product Management**
  - Add, edit, delete products
  - Image uploads
  - Inventory tracking
- **Order Processing**
  - View all orders
  - Update order status
  - Order details
- **Feature Management**
  - Create promotional features
  - Feature specific products

---

## 📂 Project Structure

<details>
<summary>Click to expand full project structure</summary>

```
📦 programmingwithnick-ecommerce
├── 📂 backend
│   ├── 📄 README.md
│   ├── 📄 eslint.config.mjs
│   ├── 📄 nest-cli.json
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   ├── 📄 tsconfig.build.json
│   ├── 📄 tsconfig.json
│   ├── 📄 .gitignore
│   ├── 📄 .prettierrc
│   ├── 📂 src
│   │   ├── 📄 app.controller.spec.ts
│   │   ├── 📄 app.controller.ts
│   │   ├── 📄 app.module.ts
│   │   ├── 📄 app.service.ts
│   │   ├── 📄 main.ts
│   │   ├── 📄 test-email.ts
│   │   ├── 📂 admin
│   │   │   ├── 📂 feature
│   │   │   │   ├── 📄 feature.controller.ts
│   │   │   │   ├── 📄 feature.module.ts
│   │   │   │   ├── 📄 feature.service.ts
│   │   │   │   └── 📂 dto
│   │   │   │       └── 📄 create-feature.dto.ts
│   │   │   ├── 📂 order
│   │   │   │   ├── 📄 order.controller.ts
│   │   │   │   ├── 📄 order.module.ts
│   │   │   │   ├── 📄 order.service.ts
│   │   │   │   └── 📂 dto
│   │   │   │       └── 📄 update-order-status.dto.ts
│   │   │   └── 📂 products
│   │   │       ├── 📄 products.controller.spec.ts
│   │   │       ├── 📄 products.controller.ts
│   │   │       ├── 📄 products.module.ts
│   │   │       ├── 📄 products.service.spec.ts
│   │   │       ├── 📄 products.service.ts
│   │   │       └── 📂 schemas
│   │   │           └── 📄 product.schema.ts
│   │   ├── 📂 auth
│   │   │   ├── 📄 auth.controller.spec.ts
│   │   │   ├── 📄 auth.controller.ts
│   │   │   ├── 📄 auth.module.ts
│   │   │   ├── 📄 auth.service.spec.ts
│   │   │   ├── 📄 auth.service.ts
│   │   │   ├── 📄 jwt-payload.interface.ts
│   │   │   ├── 📂 dto
│   │   │   │   ├── 📄 forgot-password.dto.ts
│   │   │   │   ├── 📄 login.dto.ts
│   │   │   │   └── 📄 register.dto.ts
│   │   │   ├── 📂 guards
│   │   │   │   └── 📄 jwt-auth.guard.ts
│   │   │   └── 📂 strategies
│   │   │       └── 📄 jwt.strategy.ts
│   │   ├── 📂 common
│   │   │   ├── 📂 enums
│   │   │   │   └── 📄 user-role.enum.ts
│   │   │   └── 📂 guard
│   │   │       └── 📄 admin.guard.ts
│   │   ├── 📂 database
│   │   │   ├── 📄 database.service.spec.ts
│   │   │   └── 📄 database.service.ts
│   │   ├── 📂 middleware
│   │   │   └── 📄 jwt-auth.middleware.ts
│   │   ├── 📂 models
│   │   │   ├── 📄 address.schema.ts
│   │   │   ├── 📄 cart.schema.ts
│   │   │   ├── 📄 feature.schema.ts
│   │   │   ├── 📄 order.schema.ts
│   │   │   ├── 📄 product.schema.ts
│   │   │   └── 📄 review.schema.ts
│   │   ├── 📂 shopping
│   │   │   ├── 📄 products.controller.spec.ts
│   │   │   ├── 📄 products.controller.ts
│   │   │   ├── 📄 products.module.ts
│   │   │   ├── 📄 products.service.spec.ts
│   │   │   ├── 📄 products.service.ts
│   │   │   ├── 📂 address
│   │   │   │   ├── 📄 address.controller.ts
│   │   │   │   ├── 📄 address.module.ts
│   │   │   │   ├── 📄 address.service.ts
│   │   │   │   ├── 📂 dto
│   │   │   │   │   ├── 📄 create-address.dto.ts
│   │   │   │   │   └── 📄 update-address.dto.ts
│   │   │   │   └── 📂 entities
│   │   │   │       └── 📄 address.entity.ts
│   │   │   ├── 📂 cart
│   │   │   │   ├── 📄 cart.controller.spec.ts
│   │   │   │   ├── 📄 cart.controller.ts
│   │   │   │   ├── 📄 cart.module.ts
│   │   │   │   ├── 📄 cart.service.spec.ts
│   │   │   │   ├── 📄 cart.service.ts
│   │   │   │   └── 📂 dto
│   │   │   │       └── 📄 cart.dto.ts
│   │   │   ├── 📂 order
│   │   │   │   ├── 📄 order.controller.ts
│   │   │   │   ├── 📄 order.module.ts
│   │   │   │   ├── 📄 order.service.ts
│   │   │   │   ├── 📄 paypal.provider.ts
│   │   │   │   ├── 📂 dto
│   │   │   │   │   ├── 📄 capture-payment.dto.ts
│   │   │   │   │   ├── 📄 create-order.dto.ts
│   │   │   │   │   └── 📄 update-order.dto.ts
│   │   │   │   └── 📂 entities
│   │   │   │       └── 📄 order.entity.ts
│   │   │   ├── 📂 review
│   │   │   │   ├── 📄 review.controller.ts
│   │   │   │   ├── 📄 review.module.ts
│   │   │   │   ├── 📄 review.service.ts
│   │   │   │   ├── 📂 dto
│   │   │   │   │   ├── 📄 create-review.dto.ts
│   │   │   │   │   └── 📄 update-review.dto.ts
│   │   │   │   └── 📂 entities
│   │   │   │       └── 📄 review.entity.ts
│   │   │   └── 📂 search
│   │   │       ├── 📄 search.controller.ts
│   │   │       ├── 📄 search.module.ts
│   │   │       └── 📄 search.service.ts
│   │   ├── 📂 types
│   │   │   └── 📄 express.d.ts
│   │   ├── 📂 upload
│   │   │   ├── 📄 cloudinary.provider.ts
│   │   │   ├── 📄 upload.controller.spec.ts
│   │   │   ├── 📄 upload.controller.ts
│   │   │   ├── 📄 upload.module.ts
│   │   │   ├── 📄 upload.service.spec.ts
│   │   │   ├── 📄 upload.service.ts
│   │   │   └── 📄 upload.util.ts
│   │   └── 📂 users
│   │       ├── 📄 users.controller.spec.ts
│   │       ├── 📄 users.controller.ts
│   │       ├── 📄 users.module.ts
│   │       ├── 📄 users.service.spec.ts
│   │       ├── 📄 users.service.ts
│   │       ├── 📂 dto
│   │       │   └── 📄 create-user.dto.ts
│   │       └── 📂 schemas
│   │           └── 📄 user.schema.ts
│   └── 📂 test
│       ├── 📄 app.e2e-spec.ts
│       └── 📄 jest-e2e.json
├── 📂 client
│   ├── 📄 README.md
│   ├── 📄 components.json
│   ├── 📄 eslint.config.js
│   ├── 📄 index.html
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   ├── 📄 tsconfig.app.json
│   ├── 📄 tsconfig.json
│   ├── 📄 tsconfig.node.json
│   ├── 📄 vite.config.ts
│   ├── 📄 .gitignore
│   ├── 📂 public
│   └── 📂 src
│       ├── 📄 App.css
│       ├── 📄 App.tsx
│       ├── 📄 index.css
│       ├── 📄 main.tsx
│       ├── 📄 vite-env.d.ts
│       ├── 📂 assets
│       │   ├── 📄 banner-1.webp
│       │   ├── 📄 banner-2.webp
│       │   └── 📄 banner-3.webp
│       ├── 📂 components
│       │   ├── 📂 admin
│       │   │   ├── 📄 header.tsx
│       │   │   ├── 📄 image-upload.tsx
│       │   │   ├── 📄 layout.tsx
│       │   │   ├── 📄 order-details.tsx
│       │   │   ├── 📄 orders.tsx
│       │   │   ├── 📄 product-tile.tsx
│       │   │   └── 📄 sidebar.tsx
│       │   ├── 📂 auth
│       │   │   └── 📄 layout.tsx
│       │   ├── 📂 common
│       │   │   ├── 📄 check-auth.tsx
│       │   │   ├── 📄 form.tsx
│       │   │   └── 📄 star-rating.tsx
│       │   ├── 📂 shopping
│       │   │   ├── 📄 address-card.tsx
│       │   │   ├── 📄 address.tsx
│       │   │   ├── 📄 cart-items-content.tsx
│       │   │   ├── 📄 cart-wrapper.tsx
│       │   │   ├── 📄 filter.tsx
│       │   │   ├── 📄 header.tsx
│       │   │   ├── 📄 layout.tsx
│       │   │   ├── 📄 order-details.tsx
│       │   │   ├── 📄 orders.tsx
│       │   │   ├── 📄 product-details.tsx
│       │   │   └── 📄 product-tile.tsx
│       │   └── 📂 ui
│       │       ├── 📄 alert.tsx
│       │       ├── 📄 avatar.tsx
│       │       ├── 📄 badge.tsx
│       │       ├── 📄 button.tsx
│       │       ├── 📄 card.tsx
│       │       ├── 📄 checkbox.tsx
│       │       ├── 📄 dialog.tsx
│       │       ├── 📄 dropdown-menu.tsx
│       │       ├── 📄 input.tsx
│       │       ├── 📄 label.tsx
│       │       ├── 📄 select.tsx
│       │       ├── 📄 separator.tsx
│       │       ├── 📄 sheet.tsx
│       │       ├── 📄 skeleton.tsx
│       │       ├── 📄 table.tsx
│       │       ├── 📄 tabs.tsx
│       │       ├── 📄 textarea.tsx
│       │       └── 📄 VisuallyHidden.tsx
│       ├── 📂 config
│       │   └── 📄 index.ts
│       ├── 📂 lib
│       │   └── 📄 utils.ts
│       ├── 📂 pages
│       │   ├── 📂 admin
│       │   │   ├── 📄 dashboard.tsx
│       │   │   ├── 📄 features.tsx
│       │   │   ├── 📄 order.tsx
│       │   │   └── 📄 products.tsx
│       │   ├── 📂 Auth
│       │   │   ├── 📄 forgotPassword.tsx
│       │   │   ├── 📄 logIn.tsx
│       │   │   ├── 📄 ResetPassword.tsx
│       │   │   └── 📄 signUp.tsx
│       │   ├── 📂 not-found
│       │   │   └── 📄 index.tsx
│       │   ├── 📂 shopping
│       │   │   ├── 📄 account.tsx
│       │   │   ├── 📄 checkout.tsx
│       │   │   ├── 📄 home.tsx
│       │   │   ├── 📄 listing.tsx
│       │   │   ├── 📄 payment-success.tsx
│       │   │   ├── 📄 paypal-return.tsx
│       │   │   └── 📄 search.tsx
│       │   └── 📂 unauth-page
│       │       └── 📄 index.tsx
│       ├── 📂 store
│       │   ├── 📄 authSlice.ts
│       │   ├── 📄 common-slice.ts
│       │   ├── 📄 store.ts
│       │   ├── 📂 admin
│       │   │   ├── 📄 admin-slice.ts
│       │   │   └── 📄 order-slice.ts
│       │   └── 📂 shop
│       │       ├── 📄 address-slice.ts
│       │       ├── 📄 cart-slice.ts
│       │       ├── 📄 order-slice.ts
│       │       ├── 📄 products-slice.ts
│       │       ├── 📄 review-slice.ts
│       │       └── 📄 search-slice.ts
│       └── 📂 types
│           └── 📄 order.types.ts
└── 📂 .qodo
    └── 📄 history.sqlite
```
</details>

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Clone the Repository

```bash
git clone https://github.com/ProgrammingWithNick/Ecommerce.git
cd programmingwithnick-ecommerce
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run start:dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## ⚙️ Configuration

### Backend Environment Variables (.env)

Create a `.env` file in the backend directory:

```
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRATION=24h

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

### Frontend Environment Variables (.env)

Create a `.env` file in the client directory:

```
VITE_API_URL=http://localhost:3001
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

---

## 🖥️ Usage

### Development Mode

#### Backend
```bash
npm run start:dev
```

#### Frontend
```bash
npm run dev
```

### Production Build

#### Backend
```bash
npm run build
npm run start:prod
```

#### Frontend
```bash
npm run build
```

### Testing

#### Backend
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/forgot-password` | Request password reset |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shopping/products` | Get all products |
| GET | `/api/shopping/products/:id` | Get product by ID |
| POST | `/api/admin/products` | Create new product (Admin) |
| PUT | `/api/admin/products/:id` | Update product (Admin) |
| DELETE | `/api/admin/products/:id` | Delete product (Admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shopping/cart` | Get user cart |
| POST | `/api/shopping/cart` | Add to cart |
| PUT | `/api/shopping/cart/:id` | Update cart item |
| DELETE | `/api/shopping/cart/:id` | Remove from cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shopping/order` | Get user's orders |
| GET | `/api/shopping/order/:id` | Get order details |
| POST | `/api/shopping/order` | Create order |
| PUT | `/api/admin/order/:id/status` | Update order status (Admin) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shopping/review/:productId` | Get product reviews |
| POST | `/api/shopping/review` | Create review |
| PUT | `/api/shopping/review/:id` | Update review |
| DELETE | `/api/shopping/review/:id` | Delete review |

---

## 📸 Screenshots

*[Add screenshots of your application here]*

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**ProgrammingWithNick**

- Website: [programmingwithnick.com](https://programmingwithnick.com)
- Email: nikhilkhavdu441@gmail.com
- Twitter: [@codingwithnick](https://twitter.com/codingwithnick)
- GitHub: [@programmingwithnick](https://github.com/programmingwithnick)

---

<div align="center">
  <sub>Built with ❤️ by ProgrammingWithNick</sub>
</div>
