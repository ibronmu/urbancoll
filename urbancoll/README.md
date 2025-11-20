# ArtisanHub - Multi-Vendor E-Commerce & Services Marketplace
## Complete Flutter Application for Products & Service Bookings

![ArtisanHub](https://img.shields.io/badge/ArtisanHub-v1.0.0-blue)
![Flutter](https://img.shields.io/badge/Flutter-3.0+-blue)
![Dart](https://img.shields.io/badge/Dart-3.0+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

**ArtisanHub** is a production-grade, multi-vendor Flutter marketplace application that seamlessly integrates two distinct vendor ecosystems:

- **🛍️ Product Marketplace** - Traditional e-commerce with product sellers
- **🔧 Service Marketplace** - Time-based service booking for artisans and professionals
- **💳 Integrated Payments** - Multiple payment gateways with wallet support
- **📊 Vendor Dashboard** - Complete management tools for both vendor types
- **👤 Multi-Role System** - Customer, Product Seller, Service Artisan, and Admin roles

### Key Features

✅ **Dual Vendor System**
- Product sellers managing inventory
- Service artisans managing availability and bookings
- Separate dashboards for each vendor type

✅ **Customer Features**
- Browse and search products/services
- Advanced filtering and sorting
- Shopping cart and wishlist
- Service booking with calendar
- Order and booking management
- Integrated ratings and reviews

✅ **Payment Processing**
- Stripe, PayPal integration
- Wallet system
- Multiple payment methods
- Secure transaction handling
- Refund management

✅ **Real-Time Features**
- Push notifications
- Order/Booking status updates
- In-app messaging (optional)
- Real-time availability updates

✅ **Admin Tools**
- User management
- Vendor verification
- Dispute resolution
- Global analytics
- Payment management

---

## 📁 Documentation

### Core Documents
- **[DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md)** - Complete 22-week development roadmap
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Technical patterns and code examples
- **[API_SPECIFICATION.md](API_SPECIFICATION.md)** - RESTful API documentation
- **[DEPLOYMENT_AND_OPERATIONS.md](DEPLOYMENT_AND_OPERATIONS.md)** - Deployment and CI/CD setup

### Quick Reference
- **Project Architecture** - See DEVELOPMENT_PLAN.md → Architecture Overview
- **Data Models** - See IMPLEMENTATION_GUIDE.md → Data Models Implementation
- **State Management** - See IMPLEMENTATION_GUIDE.md → State Management Patterns
- **API Integration** - See API_SPECIFICATION.md

---

## 🚀 Quick Start

### Prerequisites

```bash
flutter doctor
# Required: Flutter 3.0.0+, Dart 3.0.0+, Java 11+
```

### Installation

```bash
git clone https://github.com/yourusername/artisan-hub.git
cd artisan-hub
flutter pub get
flutterfire configure
cp config/.env.example config/dev.env
```

### Running the App

```bash
flutter run -t lib/main_dev.dart --flavor dev
```

---

## 🏗️ Project Structure

lib/
- **config/** - Configuration
- **core/** - Core utilities
- **data/** - API, models, repositories
- **domain/** - Entities, usecases
- **presentation/** - UI, screens, widgets

---

## 🛠️ Technology Stack

**Frontend:** Riverpod, Dio, Hive, Firebase, Stripe  
**Backend:** Node.js/Python, PostgreSQL, Redis  
**Deployment:** Firebase Hosting, App Store, Google Play

---

## 📝 License

MIT License - see LICENSE file for details

---

## 📞 Support

GitHub Issues: https://github.com/yourusername/artisan-hub/issues  
Documentation: See DEVELOPMENT_PLAN.md, IMPLEMENTATION_GUIDE.md, API_SPECIFICATION.md

---

**Last Updated:** November 17, 2025  
**Project Status:** 🟢 Documentation Complete
