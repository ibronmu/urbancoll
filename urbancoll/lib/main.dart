
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:urbancoll/models/app_user.dart';
import 'package:urbancoll/screens/wrapper.dart';
import 'package:urbancoll/services/auth_service.dart';
import 'package:urbancoll/services/cart_service.dart';
import 'package:urbancoll/services/firestore_service.dart';

import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<FirestoreService>(
          create: (_) => FirestoreService(),
        ),
        ChangeNotifierProvider<CartService>(
          create: (_) => CartService(),
        ),
        Provider<AuthService>(
          create: (_) => AuthService(),
        ),
        StreamProvider<AppUser?>(
          create: (context) => context.read<AuthService>().user,
          initialData: null,
        ),
      ],
      child: MaterialApp(
        title: 'UrbanColl',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          fontFamily: 'NotoSans',
        ),
        home: const Wrapper(),
      ),
    );
  }
}
