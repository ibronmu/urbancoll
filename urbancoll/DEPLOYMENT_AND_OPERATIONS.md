# ArtisanHub - Deployment & Operations Guide
## Production Setup, CI/CD, and Maintenance

**Version:** 1.0  
**Last Updated:** November 17, 2025

---

## Table of Contents
1. [Environment Configuration](#environment-configuration)
2. [CI/CD Pipeline](#cicd-pipeline)
3. [Deployment Strategy](#deployment-strategy)
4. [App Store Submission](#app-store-submission)
5. [Monitoring & Analytics](#monitoring--analytics)
6. [Troubleshooting Guide](#troubleshooting-guide)
7. [Security Checklist](#security-checklist)
8. [Maintenance Schedule](#maintenance-schedule)

---

## Environment Configuration

### Build Variants

```yaml
# pubspec.yaml configuration structure
name: artisan_hub
description: Multi-vendor marketplace for products and services
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: '3.0.0'

dependencies:
  # ... dependencies

dev_dependencies:
  # ... dev dependencies

flutter:
  uses-material-design: true
```

### Environment Variables Setup

```dart
// lib/config/environment_config.dart
enum Environment {
  dev,
  staging,
  production
}

class EnvironmentConfig {
  static Environment _environment = Environment.dev;
  static late String _baseUrl;
  static late String _firebaseProjectId;
  static late bool _enableLogging;

  static void setup({
    required Environment environment,
    required String baseUrl,
    required String firebaseProjectId,
    required bool enableLogging,
  }) {
    _environment = environment;
    _baseUrl = baseUrl;
    _firebaseProjectId = firebaseProjectId;
    _enableLogging = enableLogging;
  }

  static Environment get environment => _environment;
  static String get baseUrl => _baseUrl;
  static String get firebaseProjectId => _firebaseProjectId;
  static bool get enableLogging => _enableLogging;
  static bool get isProduction => _environment == Environment.production;
  static bool get isStaging => _environment == Environment.staging;
  static bool get isDev => _environment == Environment.dev;
}
```

### Build Configuration Files

```bash
# config/dev.env
BASE_URL=https://api-dev.artisanhub.local
FIREBASE_PROJECT_ID=artisan-hub-dev
LOG_LEVEL=debug
ENABLE_ANALYTICS=false

# config/staging.env
BASE_URL=https://api-staging.artisanhub.com
FIREBASE_PROJECT_ID=artisan-hub-staging
LOG_LEVEL=info
ENABLE_ANALYTICS=true

# config/prod.env
BASE_URL=https://api.artisanhub.com
FIREBASE_PROJECT_ID=artisan-hub-prod
LOG_LEVEL=warn
ENABLE_ANALYTICS=true
```

### Main Entry Point with Environment Setup

```dart
// lib/main.dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Determine environment
  const String flavor = String.fromEnvironment('FLAVOR', defaultValue: 'dev');
  
  final environment = _mapFlavor(flavor);

  // Setup environment
  await _setupEnvironment(environment);

  // Initialize Firebase
  await Firebase.initializeApp();

  // Setup dependencies
  setupServiceLocator();

  runApp(
    ProviderScope(
      child: const MyApp(),
    ),
  );
}

Future<void> _setupEnvironment(Environment environment) async {
  switch (environment) {
    case Environment.dev:
      EnvironmentConfig.setup(
        environment: Environment.dev,
        baseUrl: 'https://api-dev.artisanhub.local',
        firebaseProjectId: 'artisan-hub-dev',
        enableLogging: true,
      );
      break;
    case Environment.staging:
      EnvironmentConfig.setup(
        environment: Environment.staging,
        baseUrl: 'https://api-staging.artisanhub.com',
        firebaseProjectId: 'artisan-hub-staging',
        enableLogging: true,
      );
      break;
    case Environment.production:
      EnvironmentConfig.setup(
        environment: Environment.production,
        baseUrl: 'https://api.artisanhub.com',
        firebaseProjectId: 'artisan-hub-prod',
        enableLogging: false,
      );
      break;
  }
}
 
  ---

  ## Core Requirements & Specifications

  This section documents the core functional requirements and the recommended technical design for the dual-marketplace (Products + Services) described in the project brief. It is intended as a single reference for Architects, Frontend, Backend, QA and DevOps teams.

  ### 1. User Roles & Authentication

  - **Roles:** `Customer`, `ProductVendor`, `ServiceArtisan`.
  - **Single Sign-up Flow:** One onboarding flow where the user picks a role (Customer, Vendor, Artisan). The UI branches to collect role-specific information during registration (e.g., bank details or verification docs for vendors/artisans). Customers have a minimal sign-up flow.
  - **Auth Mechanism (Recommendation):** JWT-based authentication issued by the backend. Options:
    - **Firebase Auth**: Fast setup, built-in OAuth providers, works with Firebase Security Rules. Use custom claims for roles and issue secure tokens. Real-time and offline-friendly.
    - **Supabase Auth**: Postgres-backed, supports JWT, offers Row-Level Security and real-time via replication.
    - **Custom Backend (Node.js / Django)**: Full control, issue JWTs using libraries like `jsonwebtoken` (Node) or `djangorestframework-simplejwt` (Django). Required if you need custom payout flows and KYC pipelines integrated with vendors' bank providers.
  - **Profile Management Fields:**
    - Customer: `id, name, email, photoUrl, phone, addresses[]` (shipping addresses with label, geo-coordinates)
    - ProductVendor: `id, userId, shopName, description, logoUrl, bannerUrl, taxId, bankInfo {accountNumber, bankName, routing}, payoutSchedule, verificationStatus`
    - ServiceArtisan: `id, userId, displayName, description, photoUrl, skills[], serviceLocations[], verificationDocs[], rating, portfolioUrls[]`

  ### 2. Core Features by Module

  Customers:
  - Unified Home Feed (products + nearby artisans recommended by ML or business rules).
  - Separate sections: `Marketplace` (products) and `Services`.
  - Product: search, category filters, variants, add-to-cart, wishlist, checkout.
  - Service: search by skill/location, view artisan profile/portfolio, view available time slots, book a slot.
  - Orders: unified Orders screen with tabs: `Product Orders` and `Service Bookings`.
  - Real-time chat: Customer ↔ Vendor and Customer ↔ Artisan.

  Product Vendors (Vendor Dashboard):
  - Product CRUD, inventory and SKU management, price/discounts, images.
  - Order processing UI, status updates (Processing, Shipped, Delivered).
  - Sales reports and P&L per vendor, export CSV.
  - Shop profile and payout settings.

  Service Artisans (Artisan Dashboard):
  - Service listing CRUD (service title, description, duration, price, extras).
  - Availability calendar (time slots), set recurring availability, blocked dates.
  - Booking request handling (Accept / Decline / Reschedule).
  - Booking schedule view with earnings and payout history.

  ### 3. Technical Stack (Recommended)

  Recommended backend and frontend choices that satisfy real-time, security, and scalability requirements.

  Frontend (Flutter) — packages and why:
  - `riverpod` (state management): composable, testable, and scales to large apps; supports fine-grained providers for per-screen state.
  - `freezed` + `json_serializable`: immutable data classes and safe JSON parsing.
  - `dio` + `retrofit` (or `chopper`): robust http client with interceptors for auth and retries.
  - `flutter_stripe` (Stripe SDK) or `razorpay_flutter` for payments.
  - `hive` for local caching (cart, offline drafts), `shared_preferences` for feature toggles.
  - `flutter_local_notifications` + `firebase_messaging` for push notifications.
  - `google_maps_flutter` + `geolocator` for maps and geolocation.
  - `flutter_calendar_carousel` or custom calendar widget for artisan availability UI.

  Backend — options and trade-offs:
  - **Firebase Firestore + Cloud Functions** (Recommended for fastest real-time features):
    - Pros: Realtime via Firestore, built-in auth, storage, managed scaling, fast development.
    - Cons: Complex transactional workflows (multi-document transactions), vendor payouts require external services.
  - **Supabase (Postgres) + Edge Functions:**
    - Pros: Postgres with SQL power, Row-Level Security, realtime via replication; easier to query complex relationships.
    - Cons: Younger ecosystem, but a strong open-source choice.
  - **Custom REST API (Node.js/Express + PostgreSQL + Redis + Socket.IO)** (Recommended for full control):
    - Pros: Full control over business logic (payouts, KYC), can use PG for complex joins/analytics, Redis for caching/locking, WebSocket for real-time chat/booking updates.
    - Cons: More ops overhead (deploying, scaling, security).

  File Storage:
  - **Firebase Storage** or **AWS S3** for images, verification docs, product photos. Use signed URLs for secure uploads and downloads.

  Realtime & Chat:
  - **Firestore** (collections for chat messages) or **Socket.IO** / **WebSocket** if using custom backend. Use message sharding for scaling (per-room collections or channels).

  Payments:
  - **Stripe** (global, powerful): supports Connect for platform payouts (recommended for marketplaces). Use Stripe Connect with separate accounts for vendors/artisans and platform fees.
  - **Razorpay** (India-focused): supports split payments and payouts.

  Maps & Location:
  - **Google Maps SDK** for Flutter and `Places` API to capture artisan service areas and approximate distance calculations.

  Local Storage:
  - **Hive** for cart and offline state snapshots; **SharedPreferences** for small flags.

  DevOps & Hosting:
  - **Firebase Hosting** for web, Cloud Run / GKE for custom backend, Cloud Functions for serverless logic, GitHub Actions for CI/CD.

  ### 4. High-Level App Architecture

  Folder structure (suggested):

  ```
  lib/
  ├─ src/
  │  ├─ app.dart
  │  ├─ main.dart
  │  ├─ core/
  │  │  ├─ config/
  │  │  ├─ errors/
  │  │  ├─ models/
  │  │  ├─ services/   # API client, storage, payments
  │  │  └─ utils/
  │  ├─ features/
  │  │  ├─ auth/
  │  │  ├─ marketplace/  # products
  │  │  ├─ services/     # artisans & bookings
  │  │  ├─ orders/
  │  │  ├─ chat/
  │  │  └─ vendor_dashboard/
  │  ├─ widgets/
  │  └─ providers/       # Riverpod providers
  ```

  Data flow (high-level):
  - UI -> Provider/State -> UseCases/Notifiers -> Repositories -> Data Sources (REST/Firestore/Local)
  - Real-time channels (Firestore listeners or WebSocket) update providers directly, which then update UI.

  ### 5. Core Data Models (Database / Firestore collections)

  Note: keep models small and reference IDs for related entities to avoid deep nested documents in Firestore. For Postgres, normalize relations.

  - **User**: `{ id, email, phone, role, name, photoUrl, metadata }`
  - **CustomerProfile**: `{ userId, addresses[], defaultPaymentMethodId }`
  - **VendorProfile**: `{ userId, shopName, description, logoUrl, bannerUrl, taxId, bankDetails, payoutSchedule }`
  - **ArtisanProfile**: `{ userId, displayName, skills[], serviceLocations[], verificationDocs[], portfolio[] }`
  - **Product**: `{ id, vendorId, title, description, images[], variants[], price, stock, categories[], attributes[] }`
  - **Service**: `{ id, artisanId, title, description, images[], price, durationMinutes, extras[], categories[], locations[] }`
  - **Booking** (Service Booking): `{ id, serviceId, artisanId, customerId, startAt, endAt, status, price, depositPaid, paymentIntent, notes }`
  - **Order** (Product Order): `{ id, items[], customerId, vendorId, shippingAddress, status, totalAmount, paymentIntent }`
  - **Cart**: `{ customerId, items[{productId, variantId, qty}], lastUpdated }` (local + server mirror)
  - **ChatRoom**: `{ id, participants[], metadata }`
  - **Message**: `{ roomId, senderId, text, attachments[], createdAt }`
  - **Availability**: `{ artisanId, rules[], exceptions[] }` (used to generate time slots)
  - **Payout**: `{ vendorId/artisanId, amount, status, scheduledAt, transactionId }`

  ### 6. State Management Strategy

  - **Recommendation:** `Riverpod` with the following patterns:
    - **Provider Types:** `StateNotifierProvider` for complex mutable state (cart, booking flows), `FutureProvider` / `StreamProvider` for async data (profile fetch, product lists), `Provider` for lightweight singletons (API client).
    - **Session Management:** An `AuthNotifier` (StateNotifier) that holds the JWT, refresh logic, current user and role. Persist token securely (secure storage) and rehydrate at app startup.
    - **Cart State:** `CartNotifier` as a `StateNotifier` that manages local cart items and syncs with server through a `CartRepository`. Use optimistic updates, then reconcile with server responses.
    - **Real-time Updates:** `StreamProvider` or `AsyncNotifier` that listens to Firestore snapshots or WebSocket events (orders, bookings, chat) and updates corresponding notifiers.
    - **Pagination & Search:** Use paginated `StateNotifier` with page cursors; search uses debounced providers to minimize network calls.

  Why Riverpod?
  - No global mutable singletons, testable, compile-time safety with `freezed`, easy composition of providers, and good integration with Flutter.
  - Bloc/Cubit alternative: strong for event-driven, but Riverpod provides more flexible dependency injection and fine-grained rebuilds for large UI surfaces.

  ### 7. Payment Flow (Stripe & Razorpay)

  Product Payment (One-time):
  - Customer starts checkout -> client requests payment intent from backend (`/payments/create-intent`) with order details.
  - Backend creates PaymentIntent with Stripe (or Razorpay order) and returns client secret.
  - Client calls Stripe SDK to collect card info and confirm payment.
  - On success, backend verifies webhook event (`payment_intent.succeeded`) and marks order paid, triggers fulfillment workflow.

  Service Booking Payment (Deposit or Full):
  - Booking creation includes `paymentMode` (deposit|full). If deposit:
    - Backend creates a PaymentIntent for deposit amount and returns client secret.
    - On successful deposit capture, booking status moves to `awaiting_confirmation` or `confirmed` depending on artisan settings.
    - Final balance can be charged after service completion (capture) or authorized at booking time and captured later.
  - Use Stripe Connect to settle funds to artisan/vendor account minus platform fees.

  Security and PCI: Never store card data on your servers. Use the provider's SDKs and webhooks.

  ### 8. Key Widgets & UI Components

  - **ProductServiceCard:** Adaptive card that takes a `Product | Service` union model and renders the appropriate UI (price vs duration, Add to Cart vs Book Button). Include a `type` badge and micro-copy explaining what action will happen.
  - **BookingCalendarWidget:** Calendar component showing availability rules and free slots; supports timezone awareness and duration selection.
  - **VendorArtisanProfileScreen:** Adaptive profile screen that loads either Vendor or Artisan data and shows products (grid) and services (list) sections as applicable.
  - **OrdersScreen:** Unified Orders view with two tabs and filtered lists, deep links to chat and order details.

  ### 9. Implementation Plan (Phased)

  Phase 1 — Auth, User Profiles, Core Data Models (Weeks 1-3)
  - Implement auth (Firebase or custom) with role selection and profile creation flows.
  - Create user, vendor, artisan profile models and basic profile screens.
  - Setup environment configs, storage (S3/Firebase Storage), and basic CI pipeline.

  Phase 2 — Product Marketplace (Weeks 4-8)
  - Product CRUD, categories, search, filters, product details, cart, wishlist.
  - Checkout flow with Stripe integration (test mode), order creation API and webhooks.
  - Vendor dashboard basic features: add/edit products, view orders.

  Phase 3 — Services Module (Weeks 9-13)
  - Service listing CRUD, availability calendar, time-slot generation.
  - Booking flow with deposit/full-payment options, booking lifecycle, artisan dashboard for accept/decline.
  - Map integration and location-based search.

  Phase 4 — Real-time Chat & Notifications (Weeks 14-16)
  - Implement chat using Firestore or WebSocket, push notifications via FCM.
  - Real-time order/booking status updates.

  Phase 5 — Advanced Analytics & Admin Panel (Weeks 17-22)
  - Admin dashboards, vendor payouts, dispute handling, advanced reports and monitoring.
  - Hardening: rate limiting, load testing, security audit, compliance (GDPR/PCI as needed).

  ### 10. Challenge & Solution

  Challenge: Unifying Products and Services in a single UX and data model (polymorphism + unified search).

  Solution:
  - Use explicit polymorphic models and a `catalog_item` abstraction:
    - `CatalogItem` fields: `{ id, type: 'product'|'service', title, shortDescription, thumbnailUrl, searchableTags[], score }` stored in a dedicated `catalog` index or collection optimized for search.
    - Keep `Product` and `Service` as their own collections/tables with full detail.
    - Use an indexing/search layer (Algolia, ElasticSearch, or Postgres full-text + materialized views) to power unified search, faceted filters, and relevancy scoring.

  Search & UI behavior:
  - Unified home & search query hits the `catalog` index and returns `CatalogItem` results. The UI uses `type` to route to the detailed Product or Service view.
  - Filters that are specific (e.g., price ranges) are applied client-side or via the search index by precomputing searchable attributes.

  Why this works:
  - Keeps detailed domain data normalized and small in the main DB while enabling a fast, unified search experience.
  - Avoids bloated documents in Firestore and complex joins at query time.

  ---

  End of Core Requirements & Specifications.

Environment _mapFlavor(String flavor) {
  return switch (flavor) {
    'dev' => Environment.dev,
    'staging' => Environment.staging,
    'production' => Environment.production,
    _ => Environment.dev,
  };
}
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/build_and_test.yml
name: Build and Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.0.0'
          channel: 'stable'
      
      - name: Get dependencies
        run: flutter pub get
      
      - name: Run tests
        run: flutter test --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
      
      - name: Analyze code
        run: flutter analyze
      
      - name: Format check
        run: dart format --set-exit-if-changed lib/ test/

  build_android:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.0.0'
      
      - name: Get dependencies
        run: flutter pub get
      
      - name: Build APK (dev)
        if: github.ref == 'refs/heads/develop'
        run: |
          flutter build apk --flavor dev -t lib/main_dev.dart
      
      - name: Build AAB (production)
        if: github.ref == 'refs/heads/main'
        run: |
          flutter build appbundle --flavor production -t lib/main_prod.dart
      
      - name: Upload to Firebase App Distribution (dev)
        if: github.ref == 'refs/heads/develop'
        uses: wzieba/Firebase-Distribution-Github-Action@v1
        with:
          firebaseToken: ${{ secrets.FIREBASE_TOKEN }}
          projectId: artisan-hub-dev
          file: build/app/outputs/apk/dev/release/app-dev-release.apk
          groups: testers
          releaseNotes: "Dev build - ${{ github.sha }}"

  build_ios:
    runs-on: macos-latest
    needs: test
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.0.0'
      
      - name: Get dependencies
        run: flutter pub get
      
      - name: Build iOS (dev)
        if: github.ref == 'refs/heads/develop'
        run: |
          flutter build ios --flavor dev -t lib/main_dev.dart --no-codesign
      
      - name: Build iOS (production)
        if: github.ref == 'refs/heads/main'
        run: |
          flutter build ios --flavor production -t lib/main_prod.dart --no-codesign
      
      - name: Upload to TestFlight
        if: github.ref == 'refs/heads/main'
        uses: apple-actions/upload-testflight-build@v1
        with:
          app-path: build/ios/ipa/artisan_hub.ipa
          issuer-id: ${{ secrets.APPSTORE_ISSUER_ID }}
          api-key-id: ${{ secrets.APPSTORE_API_KEY_ID }}
          api-private-key: ${{ secrets.APPSTORE_API_PRIVATE_KEY }}
```

### Pre-commit Hooks

```bash
#!/bin/bash
# .husky/pre-commit

echo "Running pre-commit checks..."

# Format check
dart format --set-exit-if-changed lib/ test/
if [ $? -ne 0 ]; then
  echo "❌ Code formatting failed. Run 'dart format lib/ test/'"
  exit 1
fi

# Lint check
flutter analyze
if [ $? -ne 0 ]; then
  echo "❌ Lint errors found"
  exit 1
fi

# Run tests
flutter test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

echo "✅ All checks passed"
```

---

## Deployment Strategy

### Release Branching Strategy

```
main (production)
  ↑
  │ (PR after testing in staging)
  │
staging (pre-production)
  ↑
  │ (PR for feature completion)
  │
develop (development)
  ↑
  │
feature/* (feature branches)
bugfix/* (bugfix branches)
```

### Versioning Scheme

```
Format: MAJOR.MINOR.PATCH+BUILD_NUMBER

Examples:
- 1.0.0+1 (Initial release)
- 1.1.0+15 (New features)
- 1.1.1+16 (Bug fix)
- 2.0.0+50 (Major version)

Version Bump Rules:
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes
- BUILD_NUMBER: Always increment on each release
```

### Release Checklist

```markdown
## Pre-Release Checklist

### Code Quality
- [ ] All tests passing (100% critical path coverage)
- [ ] Code review approved
- [ ] No TODOs or FIXMEs in critical code
- [ ] Performance benchmarks met
- [ ] Memory leaks checked with DevTools

### Functionality
- [ ] All features working as per acceptance criteria
- [ ] Edge cases handled
- [ ] Error messages user-friendly
- [ ] Loading states properly implemented
- [ ] Offline functionality tested

### Security
- [ ] No hardcoded credentials
- [ ] API keys rotated
- [ ] SSL/TLS enabled
- [ ] Data encryption verified
- [ ] Permission requests justified

### UI/UX
- [ ] All screens responsive (mobile, tablet)
- [ ] Accessibility requirements met (a11y)
- [ ] RTL text handling tested (if needed)
- [ ] All device sizes tested
- [ ] Orientation changes handled

### Performance
- [ ] App startup time < 3 seconds
- [ ] Screen load time < 1.5 seconds
- [ ] List scrolling 60 FPS
- [ ] Memory usage < 150 MB baseline
- [ ] Battery impact acceptable

### Documentation
- [ ] README updated
- [ ] API documentation current
- [ ] Architecture doc updated
- [ ] Release notes written
- [ ] Known issues documented

### Backend
- [ ] API endpoints ready
- [ ] Database migrations tested
- [ ] Cache invalidation strategy ready
- [ ] Rate limiting configured
- [ ] Monitoring alerts set up

### DevOps
- [ ] Staging environment tested
- [ ] Production environment ready
- [ ] Rollback plan documented
- [ ] Database backup verified
- [ ] CDN cache configured
```

### Deployment Workflow

```bash
# 1. Create release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# 2. Update version numbers
# Update pubspec.yaml: version: 1.1.0+X
dart pub global run cider release

# 3. Update changelog
# Add entry to CHANGELOG.md

# 4. Run final tests
flutter test --coverage

# 5. Commit changes
git add pubspec.yaml CHANGELOG.md
git commit -m "chore: release v1.1.0"

# 6. Create PR to staging
git push origin release/v1.1.0

# 7. Merge to staging after approval
# (Team tests on staging environment)

# 8. Merge to main for production
git checkout main
git pull origin main
git merge release/v1.1.0 --no-ff
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin main --tags

# 9. Delete release branch
git push origin --delete release/v1.1.0
git branch -D release/v1.1.0
```

---

## App Store Submission

### iOS App Store

#### 1. Setup Certificates and Profiles

```bash
# Create certificate signing request in Keychain Access
# Download certificate from Apple Developer
# Create provisioning profiles for development, staging, and production
```

#### 2. Configure Project

```swift
// ios/Runner/Info.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>ArtisanHub</string>
    <key>CFBundleIdentifier</key>
    <string>com.artisanhub.app</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <false/>
    </dict>
    <key>NSCameraUsageDescription</key>
    <string>We need camera access for product photography</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>We need access to your photos for product uploads</string>
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>We need your location to find nearby services</string>
    <key>NSUserTrackingUsageDescription</key>
    <string>We use data to improve your experience</string>
</dict>
</plist>
```

#### 3. Build for App Store

```bash
# Clean build
flutter clean

# Get dependencies
flutter pub get

# Build IPA
flutter build ipa \
  --target=lib/main_production.dart \
  --export-method=app-store

# Or use Xcode
open ios/Runner.xcworkspace

# In Xcode:
# 1. Select Generic iOS Device
# 2. Product → Scheme → Runner
# 3. Product → Archive
# 4. Distribute App → App Store Connect
```

#### 4. Submit to App Store

- Use App Store Connect (https://appstoreconnect.apple.com)
- Upload via Xcode or Transporter
- Complete app information (screenshots, description, keywords)
- Set pricing and availability
- Configure app privacy
- Submit for review

**Review Timeline:** 1-3 business days (typically)

### Android Google Play Store

#### 1. Setup Signing Keys

```bash
# Generate keystore
keytool -genkey -v -keystore ~/keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias artisan_hub_key

# Create key.properties file
# android/key.properties
storeFile=/path/to/keystore.jks
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=artisan_hub_key
```

#### 2. Configure Gradle

```gradle
// android/app/build.gradle.kts
android {
    signingConfigs {
        release {
            keyAlias = keyProperties['keyAlias']
            keyPassword = keyProperties['keyPassword']
            storeFile = file(keyProperties['storeFile'])
            storePassword = keyProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.release
        }
    }
}
```

#### 3. Build App Bundle

```bash
# Clean build
flutter clean

# Get dependencies
flutter pub get

# Build AAB for Play Store
flutter build appbundle \
  --target=lib/main_production.dart

# Or build APK for testing
flutter build apk --split-per-abi \
  --target=lib/main_production.dart
```

#### 4. Submit to Google Play

- Use Google Play Console (https://play.google.com/console)
- Upload AAB file
- Create release name and notes
- Complete store listing (screenshots, description, ratings)
- Configure pricing and distribution
- Submit for review

**Review Timeline:** Usually approved within 2-4 hours

### Web Deployment

#### 1. Build for Web

```bash
flutter build web --release --web-renderer html
```

#### 2. Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init hosting

# Deploy
firebase deploy

# Check deployment
firebase open hosting:site
```

#### 3. Alternative: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel ./build/web

# Configure domain and SSL
```

#### 4. Setup CDN and Caching

```yaml
# firebase.json
{
  "hosting": {
    "public": "build/web",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      },
      {
        "source": "/static/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

---

## Monitoring & Analytics

### Firebase Analytics Setup

```dart
// lib/services/analytics_service.dart
import 'package:firebase_analytics/firebase_analytics.dart';

class AnalyticsService {
  static final FirebaseAnalytics _analytics = FirebaseAnalytics.instance;

  /// Log page view
  static Future<void> logPageView({
    required String pageName,
    String? pageClass,
  }) async {
    await _analytics.logEvent(
      name: 'page_view',
      parameters: {
        'page_name': pageName,
        'page_class': pageClass,
      },
    );
  }

  /// Log search
  static Future<void> logSearch({
    required String searchTerm,
    String? searchCategory,
  }) async {
    await _analytics.logSearch(
      searchTerm: searchTerm,
      parameters: {
        'category': searchCategory,
      },
    );
  }

  /// Log product view
  static Future<void> logProductView({
    required String productId,
    required String productName,
    String? category,
    double? price,
  }) async {
    await _analytics.logViewItem(
      currency: 'USD',
      value: price ?? 0,
      items: [
        AnalyticsEventItem(
          itemId: productId,
          itemName: productName,
          itemCategory: category,
          price: price,
        ),
      ],
    );
  }

  /// Log purchase
  static Future<void> logPurchase({
    required String orderId,
    required double value,
    required String currency,
    List<AnalyticsEventItem>? items,
  }) async {
    await _analytics.logPurchase(
      currency: currency,
      value: value,
      transactionId: orderId,
      items: items ?? [],
    );
  }

  /// Log booking
  static Future<void> logBooking({
    required String bookingId,
    required String serviceId,
    required double price,
  }) async {
    await _analytics.logEvent(
      name: 'book_service',
      parameters: {
        'booking_id': bookingId,
        'service_id': serviceId,
        'price': price,
      },
    );
  }

  /// Log custom event
  static Future<void> logEvent({
    required String name,
    Map<String, Object>? parameters,
  }) async {
    await _analytics.logEvent(
      name: name,
      parameters: parameters,
    );
  }
}
```

### Crash Reporting with Firebase Crashlytics

```dart
// lib/services/crash_reporting_service.dart
import 'package:firebase_crashlytics/firebase_crashlytics.dart';

class CrashReportingService {
  static Future<void> initialize() async {
    // Pass all uncaught errors to Crashlytics
    PlatformDispatcher.instance.onError = (error, stack) {
      FirebaseCrashlytics.instance.recordError(error, stack);
      return true;
    };

    // Handle Flutter errors
    FlutterError.onError = (details) {
      FirebaseCrashlytics.instance.recordFlutterError(details);
    };
  }

  /// Log non-fatal exception
  static Future<void> recordException(
    Object exception,
    StackTrace stack, {
    String? context,
  }) async {
    await FirebaseCrashlytics.instance.recordError(
      exception,
      stack,
      reason: context,
      fatal: false,
    );
  }

  /// Set user information for crash reports
  static Future<void> setUserInfo({
    required String userId,
    String? email,
  }) async {
    await FirebaseCrashlytics.instance.setUserIdentifier(userId);
    if (email != null) {
      await FirebaseCrashlytics.instance.setCustomKey('email', email);
    }
  }

  /// Log custom key-value pair
  static Future<void> setCustomKey(String key, dynamic value) async {
    await FirebaseCrashlytics.instance.setCustomKey(key, value.toString());
  }
}
```

### Performance Monitoring

```dart
// lib/services/performance_monitoring_service.dart
import 'package:firebase_performance/firebase_performance.dart';

class PerformanceMonitoringService {
  static final _performance = FirebasePerformance.instance;

  /// Measure screen load time
  static Future<void> measureScreenLoad({
    required String screenName,
    required Future<void> Function() operation,
  }) async {
    final trace = _performance.newTrace('screen_load_$screenName');
    await trace.start();

    try {
      await operation();
    } finally {
      await trace.stop();
    }
  }

  /// Measure API call performance
  static Future<void> measureApiCall({
    required String endpoint,
    required Future<void> Function() operation,
  }) async {
    final trace = _performance.newTrace('api_call_$endpoint');
    await trace.start();

    try {
      await operation();
    } finally {
      await trace.stop();
    }
  }

  /// Track custom metrics
  static Future<void> trackMetric({
    required String metricName,
    required int value,
  }) async {
    final trace = _performance.newTrace(metricName);
    await trace.start();
    trace.incrementMetric(metricName, value);
    await trace.stop();
  }
}
```

### Application Insights

```dart
// lib/services/insights_service.dart
class InsightsService {
  /// Track active users
  static Future<void> trackActiveUser(String userId) async {
    // Implement custom tracking
  }

  /// Track feature usage
  static Future<void> trackFeatureUsage(String featureName) async {
    // Implement custom tracking
  }

  /// Track conversion funnel
  static Future<void> trackConversionFunnel({
    required String funnelName,
    required int step,
    required String stepName,
  }) async {
    // Implement custom tracking
  }

  /// Track retention
  static Future<void> trackRetention(String userId) async {
    // Implement custom tracking
  }
}
```

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Build Issues

```bash
# Issue: "Cannot find Flutter"
Solution: Ensure Flutter is in PATH
export PATH="$PATH:/path/to/flutter/bin"

# Issue: "Gradle build failed"
Solution: Clean gradle cache
./gradlew clean
flutter clean
flutter pub get
flutter build apk

# Issue: "CocoaPods dependency error"
Solution: Update CocoaPods
cd ios
pod repo update
pod install
cd ..
```

#### Performance Issues

```dart
// Issue: Slow list rendering
Solution: Use ListView.builder instead of ListView

// Issue: Memory leaks
Solution: Dispose controllers and listeners properly
@override
void dispose() {
  _controller.dispose();
  super.dispose();
}

// Issue: Janky animations
Solution: Profile with DevTools
flutter run --profile
# Use Dart DevTools → Timeline tab
```

#### API Integration Issues

```dart
// Issue: 401 Unauthorized
Solution: Refresh token and retry

// Issue: Network timeouts
Solution: Increase timeout and implement retry logic
const Duration connectionTimeout = Duration(seconds: 60);

// Issue: CORS errors (Web)
Solution: Configure backend CORS properly
```

---

## Security Checklist

### Pre-Launch Security Audit

```markdown
## Security Verification

### Authentication & Authorization
- [ ] Password requirements enforced (min 8 chars, complexity)
- [ ] Account lockout after failed attempts
- [ ] Session timeout implemented
- [ ] JWT tokens have expiration
- [ ] Refresh tokens stored securely
- [ ] Role-based access control working
- [ ] Permissions verified on each request

### Data Protection
- [ ] HTTPS/TLS enabled for all connections
- [ ] Sensitive data encrypted at rest
- [ ] PII not logged or cached
- [ ] No credentials in code/config files
- [ ] Database encryption enabled
- [ ] Backup encryption enabled

### API Security
- [ ] API rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] XSS prevention (if web)
- [ ] CSRF tokens used (if applicable)
- [ ] API versioning implemented

### Mobile Security
- [ ] Jailbreak/rooting detection
- [ ] Code obfuscation enabled
- [ ] Certificate pinning implemented
- [ ] Local storage encryption enabled
- [ ] Secure shared preferences usage

### Third-party Services
- [ ] Firebase security rules configured
- [ ] API keys scoped appropriately
- [ ] OAuth credentials secure
- [ ] Payment gateway PCI compliance
- [ ] Analytics data privacy compliant

### Code Security
- [ ] No hardcoded secrets
- [ ] Dependencies up to date
- [ ] Security headers configured
- [ ] OWASP best practices followed
- [ ] Penetration testing completed
```

---

## Maintenance Schedule

### Daily Tasks
- Monitor app crashes
- Check API health
- Review security alerts
- Monitor user support tickets

### Weekly Tasks
- Review analytics trends
- Check performance metrics
- Update dependencies (if critical)
- Database backups verification

### Monthly Tasks
- Security patch updates
- Performance optimization review
- User feedback analysis
- Feature usage analysis

### Quarterly Tasks
- Major version planning
- Architecture review
- Scalability assessment
- Security audit

### Annually Tasks
- App store guideline review
- Platform update compatibility check
- Cost optimization review
- Strategic roadmap planning

---

## Support and Escalation

### Issue Severity Levels

| Level | Response Time | Example |
|-------|---------------|---------|
| Critical | 1 hour | App crashes, payment issues, security breach |
| High | 4 hours | Missing features, major bugs |
| Medium | 1 business day | UI issues, performance degradation |
| Low | 3 business days | Minor bugs, feature requests |

### Incident Response Protocol

```
1. Alert triggered
   ↓
2. Initial assessment (10 min)
   ├─ Confirm issue
   └─ Determine severity
   ↓
3. Notification (15 min)
   ├─ Alert team
   └─ Notify stakeholders
   ↓
4. Investigation (varies)
   ├─ Check logs
   ├─ Review recent changes
   └─ Reproduce issue
   ↓
5. Fix Implementation
   ├─ Develop patch
   ├─ Test fix
   └─ Deploy fix
   ↓
6. Verification
   ├─ Monitor metrics
   └─ Confirm resolution
   ↓
7. Post-Mortem
   ├─ Document incident
   ├─ Identify root cause
   └─ Plan prevention
```

---

## Conclusion

This deployment and operations guide provides comprehensive instructions for deploying ArtisanHub to production and maintaining it at scale. Following these procedures ensures reliability, security, and optimal performance for users across all platforms.

Key takeaways:
- Use environment configuration for multi-environment support
- Implement CI/CD for automated testing and deployment
- Monitor performance and crashes proactively
- Follow security best practices at every step
- Maintain comprehensive documentation
- Plan for maintenance and scalability

