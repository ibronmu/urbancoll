// Import the Flutter Material package, which provides UI components like buttons, text, and layouts.
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/products/products.dart';
import 'screens/auth/auth.dart';
import 'screens/vendor/vendor_dashboard.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String? _token;
  int _index = 0;

  @override
  void initState() {
    super.initState();
    _restoreToken();
  }

  Future<void> _restoreToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('accessToken');
    if (token != null) {
      setState(() {
        _token = token;
      });
    }
  }

  Future<void> _onLogin(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('accessToken', token);
    setState(() {
      _token = token;
    });
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('accessToken');
    setState(() {
      _token = null;
      _index = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(
          title: const Text('UrbanColl'),
          actions: _token != null
              ? [IconButton(onPressed: _logout, icon: const Icon(Icons.logout))]
              : null,
        ),
        body: _token == null
            ? AuthPage(onLogin: _onLogin)
            : IndexedStack(
                index: _index,
                children: [
                  const Products(),
                  VendorDashboard(token: _token!),
                ],
              ),
        bottomNavigationBar: _token == null
            ? null
            : BottomNavigationBar(
                currentIndex: _index,
                onTap: (i) => setState(() => _index = i),
                items: const [
                  BottomNavigationBarItem(
                    icon: Icon(Icons.store),
                    label: 'Shop',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(Icons.dashboard),
                    label: 'Vendor',
                  ),
                ],
              ),
      ),
    );
  }
}
