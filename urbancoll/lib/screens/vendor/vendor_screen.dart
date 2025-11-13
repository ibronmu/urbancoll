
import 'package:flutter/material.dart';
import 'package:urbancoll/models/product_model.dart';
import 'package:urbancoll/services/auth_service.dart';
import 'package:urbancoll/services/firestore_service.dart';

class VendorScreen extends StatelessWidget {
  const VendorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final AuthService auth = AuthService();
    final FirestoreService db = FirestoreService();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Vendor'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              Navigator.pushNamed(context, '/add_product');
            },
          ),
          IconButton(
            icon: const Icon(Icons.exit_to_app),
            onPressed: () async {
              await auth.signOut();
            },
          ),
        ],
      ),
      body: StreamBuilder<List<Product>>(
        stream: db.getVendorProducts(auth.getCurrentUser()!.uid),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          }
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          return ListView.builder(
            itemCount: snapshot.data!.length,
            itemBuilder: (context, index) {
              final product = snapshot.data![index];
              return ListTile(
                leading: Image.network(product.imageUrl),
                title: Text(product.name),
                subtitle: Text('\$${product.price}'),
                trailing: IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () {
                    db.deleteProduct(product.id);
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}
