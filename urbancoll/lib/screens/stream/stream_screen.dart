
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:urbancoll/models/app_user.dart';
import 'package:urbancoll/screens/auth/auth_screen.dart';
import 'package:urbancoll/screens/home/home_screen.dart';

class StreamScreen extends StatelessWidget {
  const StreamScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AppUser?>(context);

    if (user == null) {
      return const AuthScreen();
    } else {
      return const HomeScreen();
    }
  }
}
