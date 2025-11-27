
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:urbancoll/models/app_user.dart';
import 'package:urbancoll/services/firestore_service.dart';

class VendorSignupScreen extends StatefulWidget {
  const VendorSignupScreen({super.key});

  @override
  State<VendorSignupScreen> createState() => _VendorSignupScreenState();
}

class _VendorSignupScreenState extends State<VendorSignupScreen> {
  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AppUser?>(context);
    final db = Provider.of<FirestoreService>(context, listen: false);
    final scaffoldMessenger = ScaffoldMessenger.of(context);
    final navigator = Navigator.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Become a Vendor'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const Text(
                'Join our platform as a vendor and start selling your products.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () async {
                  if (user != null) {
                    await db.updateUser(user.uid, {'role': 'vendor'});
                    scaffoldMessenger.showSnackBar(
                      const SnackBar(content: Text('Congratulations! You are now a vendor.')),
                    );
                    navigator.pop();
                  } else {
                    scaffoldMessenger.showSnackBar(
                      const SnackBar(content: Text('You must be signed in to become a vendor.')),
                    );
                  }
                },
                child: const Text('Become a Vendor'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
