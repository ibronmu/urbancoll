
import 'package:flutter/material.dart';
import 'package:urbancoll/services/firestore_service.dart';

import '../../models/product_model.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final FirestoreService db = FirestoreService();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: StreamBuilder<List<Product>>(
        stream: db.getProducts(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          }
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          return GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
            ),
            itemCount: snapshot.data!.length,
            itemBuilder: (context, index) {
              final product = snapshot.data![index];
              return Card(
                child: Column(
                  children: [
                    Image.network(product.imageUrl),
                    Text(product.name),
                    Text('\$${product.price}'),
                    ElevatedButton(
                      child: const Text('Add to Cart'),
                      onPressed: () {
                        // Add to cart functionality
                      },
                    )
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
