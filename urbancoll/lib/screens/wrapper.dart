
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:urbancoll/models/app_user.dart';
import 'package:urbancoll/screens/auth/auth_screen.dart';
import 'package:urbancoll/screens/main_screen.dart'; // Updated import

class Wrapper extends StatelessWidget {
  const Wrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AppUser?>(context);

    // Return either AuthScreen or MainScreen
    if (user == null) {
      return const AuthScreen();
    } else {
      return const MainScreen(); // Direct all logged-in users to MainScreen
    }
  }
}
