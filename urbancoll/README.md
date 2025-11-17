# UrbanColl

UrbanColl is a modern e-commerce application built with Flutter and Firebase. It offers a seamless shopping experience for the latest urban fashion trends. The app is designed to be fully responsive, providing an optimal user experience on both mobile and web platforms.

## Live Demo

You can view the live application at [urbancoll.web.app](https://urbancoll.web.app).

## Features

*   **Responsive Design**: Looks great on both mobile and web.
*   **Firebase Authentication**: Secure user login and registration.
*   **Product Catalog**: Browse a grid of urban fashion products.
*   **Shopping Cart**: Add and manage items in your cart.

## Project Structure

The project is organized into the following main directories:

*   `lib/`: Contains all the Dart code for the Flutter application.
    *   `screens/`: Contains the UI for each screen of the app (e.g., `home_screen.dart`, `auth_screen.dart`).
    *   `widgets/`: Contains reusable UI components (e.g., `custom_button.dart`, `product_card.dart`).
    *   `models/`: Contains the data models for the app (e.g., `product.dart`).
    *   `main.dart`: The entry point of the application.
    *   `firebase_options.dart`: **(Git-ignored)** Contains the Firebase configuration for your project.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Flutter SDK: [https://flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install)
*   A code editor like VS Code or Android Studio.

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username/urbancoll.git
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
