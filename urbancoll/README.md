# UrbanColl

UrbanColl is a modern e-commerce application built with Flutter and Firebase. It offers a seamless shopping experience for the latest urban fashion trends. The app is designed to be fully responsive, providing an optimal user experience on both mobile and web platforms.

## GitHub Repository

The source code for this project is available on GitHub at [https://github.com/ibronmu/urbancoll.git](https://github.com/ibronmu/urbancoll.git).

## Live Demo

You can view the live application at [urbancoll-89617707-90dc8.web.app](https://urbancoll-89617707-90dc8.web.app).

## Features

*   **Responsive Design**: Looks great on both mobile and web.
*   **Firebase Authentication**: Secure user login and registration with email and password.
*   **User Roles**: Separate sign-up and functionality for regular users and vendors.
*   **Product Catalog**: Browse a grid of urban fashion products with search and filtering.
*   **Product Details**: View detailed information about each product, including images, description, price, and customer reviews.
*   **Shopping Cart**: Add and manage items in your cart.
*   **Checkout Process**: A streamlined checkout process to place orders.
*   **Order Management**: View and track your order history.
*   **Vendor Dashboard**: A dedicated dashboard for vendors to manage their products and view orders.
*   **Add and Manage Products**: Vendors can add new products and manage their existing inventory.
*   **Customer Reviews**: Users can leave reviews and ratings for products.
*   **Real-time Notifications**: Receive real-time notifications for important events.

## User Roles

*   **User**: Can browse products, add items to the cart, checkout, view order history, and leave reviews.
*   **Vendor**: Can add and manage products, view and manage orders for their products, and have a dedicated vendor profile.

## Project Structure

The project is organized into the following main directories:

*   `lib/`: Contains all the Dart code for the Flutter application.
    *   `screens/`: Contains the UI for each screen of the app, organized by feature (e.g., `home`, `auth`, `cart`, `product`, `profile`, `vendor`).
    *   `widgets/`: Contains reusable UI components (e.g., `custom_button.dart`, `product_card.dart`).
    *   `models/`: Contains the data models for the app (e.g., `product.dart`, `app_user.dart`, `order.dart`).
    *   `services/`: Contains the business logic and services for interacting with Firebase and other APIs (e.g., `auth_service.dart`, `firestore_service.dart`, `cart_service.dart`).
    *   `main.dart`: The entry point of the application.
    *   `theme.dart`: Defines the application's theme and styling.
    *   `firebase_options.dart`: **(Git-ignored)** Contains the Firebase configuration for your project.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Flutter SDK: [https://flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install)
*   A code editor like VS Code or Android Studio.

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/ibronmu/urbancoll.git
    ```
2.  **Install packages**
    ```sh
    flutter pub get
    ```
3.  **Create your own `firebase_options.dart`**

    This file is ignored by Git to protect sensitive API keys. You will need to create your own `firebase_options.dart` file in the `lib/` directory and populate it with the configuration from your own Firebase project.

4.  **Run the app**
    ```sh
    flutter run
    ```

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
