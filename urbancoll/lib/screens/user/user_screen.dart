
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:urbancoll/models/app_user.dart';
import 'package:urbancoll/models/product.dart';
import 'package:urbancoll/screens/vendor/vendor_signup_screen.dart';
import 'package:urbancoll/services/firestore_service.dart';

class UserScreen extends StatefulWidget {
  const UserScreen({super.key});

  @override
  State<UserScreen> createState() => _UserScreenState();
}

class _UserScreenState extends State<UserScreen> {
  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AppUser?>(context);
    final db = Provider.of<FirestoreService>(context, listen: false);
    final scaffoldMessenger = ScaffoldMessenger.of(context);

    final isVendor = user?.role == 'vendor';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'User Profile',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Text(
              'UID: ${user?.uid ?? 'Not signed in'}',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              'Role: ${user?.role ?? 'Not signed in'}',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: isVendor
                  ? null
                  : () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const VendorSignupScreen(),
                        ),
                      );
                    },
              child: const Text('Become a Vendor'),
            ),
            if (isVendor)
              const Padding(
                padding: EdgeInsets.only(top: 8.0),
                child: Text(
                  'You are already a vendor.',
                  style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
                ),
              ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: isVendor
                  ? () async {
                      if (user != null) {
                        final vendorId = user.uid;
                        final sampleProducts = [
                          Product(
                              id: '',
                              name: 'Classic Leather Jacket',
                              description: 'A timeless leather jacket for any occasion.',
                              price: 149.99,
                              imageUrl: 'https://picsum.photos/seed/jacket/400/400',
                              category: 'Product',
                              vendorId: vendorId),
                          Product(
                              id: '',
                              name: 'Graphic Design Services',
                              description: 'Professional graphic design for your brand.',
                              price: 299.99,
                              imageUrl: 'https://picsum.photos/seed/design/400/400',
                              category: 'Service',
                              vendorId: vendorId),
                          Product(
                              id: '',
                              name: 'Gourmet Coffee Beans',
                              description: 'Freshly roasted, single-origin coffee beans.',
                              price: 19.99,
                              imageUrl: 'https://picsum.photos/seed/coffee/400/400',
                              category: 'Eatery',
                              vendorId: vendorId),
                        ];

                        for (final product in sampleProducts) {
                          await db.addProduct(product);
                        }
                        scaffoldMessenger.showSnackBar(
                          const SnackBar(content: Text('Sample products added!')),
                        );
                      }
                    }
                  : null,
              child: const Text('Add Sample Products'),
            ),
          ],
        ),
      ),
    );
  }
}
